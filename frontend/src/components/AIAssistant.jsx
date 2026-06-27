import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../context/LocationContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend, FiLoader, FiMessageSquare } from "react-icons/fi";

const SUGGESTIONS = [
  "Find nearby doctors",
  "Show electricians",
  "Upcoming events",
  "Emergency contacts",
  "Nearest hospital",
];

function processQuery(query, locationName, navigate) {
  const q = query.toLowerCase();
  const loc = locationName ? ` near ${locationName}` : "";

  const patterns = [
    {
      match: /doctor|physician|medical|clinic/,
      response: `Looking for doctors${loc}. I'll take you to the providers page filtered by Doctor.`,
      action: () => navigate("/providers?category=Doctor"),
    },
    {
      match: /hospital/,
      response: `Showing hospitals${loc}.`,
      action: () => navigate("/providers?category=Hospital"),
    },
    {
      match: /electrician|electric/,
      response: `Finding electricians${loc} for you.`,
      action: () => navigate("/providers?category=Electrician"),
    },
    {
      match: /plumber|plumbing|water leak|pipe/,
      response: `Searching for plumbers${loc}.`,
      action: () => navigate("/providers?category=Plumber"),
    },
    {
      match: /pharmacy|medicine|chemist|drug/,
      response: `Locating pharmacies${loc}.`,
      action: () => navigate("/providers?category=Pharmacy"),
    },
    {
      match: /grocery|supermarket|store|shop/,
      response: `Finding grocery stores${loc}.`,
      action: () => navigate("/providers?category=Grocery Store"),
    },
    {
      match: /taxi|cab|auto|transport/,
      response: `Searching for taxis${loc}.`,
      action: () => navigate("/providers?category=Taxi"),
    },
    {
      match: /emergency|ambulance|fire|police/,
      response: `Taking you to the Emergency Information page with all emergency contacts${loc}.`,
      action: () => navigate("/emergency"),
    },
    {
      match: /event|festival|camp|meeting|drive/,
      response: `Checking upcoming events and community activities${loc}.`,
      action: () => navigate("/events"),
    },
    {
      match: /complaint|issue|problem|road|pothole|water|garbage/,
      response: "I'll take you to the Complaints Portal where you can report any local issue.",
      action: () => navigate("/complaints"),
    },
    {
      match: /blood bank|blood/,
      response: `Looking for blood banks${loc}.`,
      action: () => navigate("/emergency"),
    },
    {
      match: /internet|wifi|broadband|isp/,
      response: `Finding internet providers${loc}.`,
      action: () => navigate("/providers?category=Internet Provider"),
    },
    {
      match: /carpenter|furniture|woodwork/,
      response: `Searching for carpenters${loc}.`,
      action: () => navigate("/providers?category=Carpenter"),
    },
    {
      match: /tutor|teacher|coaching|education|school/,
      response: `Finding tutors${loc}.`,
      action: () => navigate("/providers?category=Tutor"),
    },
    {
      match: /milk|dairy/,
      response: `Looking for milk suppliers${loc}.`,
      action: () => navigate("/providers?category=Milk Supplier"),
    },
    {
      match: /hello|hi|hey|namaste/,
      response: `Namaste! 👋 I'm your Panchayat AI assistant. I can help you find nearby services, events, and emergency contacts${loc}. What are you looking for?`,
    },
    {
      match: /help|what can you do|capabilities/,
      response: `I can help you:\n• Find nearby services (doctors, electricians, plumbers, etc.)\n• Show emergency contacts (hospitals, police, ambulance)\n• Check upcoming events\n• Report complaints\n• Filter by distance\n\nJust ask me what you need!`,
    },
    {
      match: /location|near me|nearby/,
      response: locationName
        ? `Your current location is set to ${locationName}. All services and events are showing based on this location.`
        : "Your location hasn't been set yet. Click the 📍 Set Location button in the navigation to detect your location.",
    },
    {
      match: /provider|service|professional/,
      response: `I'll show you all available service providers${loc}.`,
      action: () => navigate("/providers"),
    },
  ];

  for (const p of patterns) {
    if (p.match.test(q)) {
      return { text: p.response, action: p.action };
    }
  }

  // Try to interpret as a search
  const searchTerms = query.trim();
  if (searchTerms.length > 2) {
    return {
      text: `Let me search for "${searchTerms}"${loc} in our providers database.`,
      action: () => navigate(`/providers?search=${encodeURIComponent(searchTerms)}`),
    };
  }

  return {
    text: "I didn't quite understand that. Try asking me to 'find doctors', 'show electricians', 'upcoming events', or 'emergency contacts'.",
  };
}

function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Namaste! 👋 I'm your Panchayat AI assistant. How can I help you today?\n\nTry asking:\n• \"Find nearby doctors\"\n• \"Show electricians\"\n• \"Any events today?\"\n• \"Emergency contacts\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { locationName } = useLocation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const q = text || input;
    if (!q.trim()) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setThinking(true);

    await new Promise((r) => setTimeout(r, 600));

    const result = processQuery(q, locationName, navigate);
    setThinking(false);
    setMessages((prev) => [...prev, { role: "ai", text: result.text }]);

    if (result.action) {
      setTimeout(() => {
        result.action();
        setOpen(false);
      }, 1200);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-3.5 rounded-2xl shadow-xl font-semibold text-sm"
      >
        <FiMessageSquare size={18} />
        AI Assistant
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-[340px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ maxHeight: "500px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-lg">🤖</div>
                <div>
                  <p className="text-white font-bold text-sm">Panchayat AI</p>
                  <p className="text-blue-100 text-xs">Your local guide assistant</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition p-1">
                <FiX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5">🤖</div>
                  )}
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm">🤖</div>
                  <div className="bg-white border border-gray-100 shadow-sm px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
              <div className="px-4 py-2 bg-white border-t border-gray-100">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="flex-shrink-0 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition font-medium whitespace-nowrap"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about nearby services..."
                className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={thinking || !input.trim()}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition flex-shrink-0"
              >
                {thinking ? <FiLoader size={15} className="animate-spin" /> : <FiSend size={15} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIAssistant;
