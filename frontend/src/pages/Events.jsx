import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIAssistant from "../components/AIAssistant";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiClock, FiUser, FiHeart, FiBell, FiBellOff } from "react-icons/fi";

const CATEGORIES = ["All", "General", "Health", "Environment", "Community", "Education", "Sports", "Cultural"];

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [interested, setInterested] = useState(() => {
    try { return JSON.parse(localStorage.getItem("interestedEvents") || "{}"); } catch { return {}; }
  });
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("eventReminders") || "{}"); } catch { return {}; }
  });

  useEffect(() => {
    axios.get("/api/events")
      .then((r) => { setEvents(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleInterested = async (eventId) => {
    const wasInterested = interested[eventId];
    const newInterested = { ...interested, [eventId]: !wasInterested };
    setInterested(newInterested);
    localStorage.setItem("interestedEvents", JSON.stringify(newInterested));

    try {
      await axios.post(`/api/events/${eventId}/interested`, { delta: wasInterested ? -1 : 1 });
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId
            ? { ...e, interestedCount: (e.interestedCount || 0) + (wasInterested ? -1 : 1) }
            : e
        )
      );
    } catch { /* silent */ }
  };

  const toggleReminder = (event) => {
    const hasReminder = reminders[event._id];
    const newReminders = { ...reminders };

    if (hasReminder) {
      delete newReminders[event._id];
      setReminders(newReminders);
      localStorage.setItem("eventReminders", JSON.stringify(newReminders));
    } else {
      newReminders[event._id] = {
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
      };
      setReminders(newReminders);
      localStorage.setItem("eventReminders", JSON.stringify(newReminders));
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
    } catch { return d; }
  };

  const isUpcoming = (d) => new Date(d) >= new Date();
  const isPast = (d) => new Date(d) < new Date();

  const filtered = activeCategory === "All"
    ? events
    : events.filter((e) => e.category === activeCategory);

  const upcoming = filtered.filter((e) => isUpcoming(e.date));
  const past = filtered.filter((e) => isPast(e.date));

  const categoryColor = {
    General: "bg-blue-100 text-blue-700",
    Health: "bg-green-100 text-green-700",
    Environment: "bg-emerald-100 text-emerald-700",
    Community: "bg-purple-100 text-purple-700",
    Education: "bg-indigo-100 text-indigo-700",
    Sports: "bg-orange-100 text-orange-700",
    Cultural: "bg-pink-100 text-pink-700",
  };

  const EventCard = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition ${isPast(event.date) ? "opacity-60" : "border-gray-100"}`}
    >
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColor[event.category] || "bg-gray-100 text-gray-700"}`}>
              {event.category || "General"}
            </span>
            <h2 className="font-extrabold text-gray-900 text-base mt-2 line-clamp-2">{event.title}</h2>
          </div>
          <div className="bg-blue-600 text-white rounded-xl px-2.5 py-1 text-center flex-shrink-0 min-w-[48px]">
            <p className="text-xs font-bold leading-none">
              {new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit" })}
            </p>
            <p className="text-[10px] uppercase mt-0.5">
              {new Date(event.date).toLocaleDateString("en-IN", { month: "short" })}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-2">
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <FiCalendar size={12} /> {formatDate(event.date)}
          {event.time && <span className="ml-1 text-gray-400">• {event.time}</span>}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <FiMapPin size={12} /> {event.location}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <FiUser size={12} /> Organizer: {event.organizer || "Gram Panchayat"}
        </p>
        {event.description && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">{event.description}</p>
        )}
      </div>

      <div className="px-5 pb-5 flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <FiHeart size={11} className={interested[event._id] ? "text-red-500" : ""} />
          {event.interestedCount || 0} interested
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => toggleReminder(event)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              reminders[event._id]
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={reminders[event._id] ? "Remove reminder" : "Set reminder"}
          >
            {reminders[event._id] ? <FiBell size={12} /> : <FiBellOff size={12} />}
            {reminders[event._id] ? "Reminded" : "Remind"}
          </button>
          <button
            onClick={() => toggleInterested(event._id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              interested[event._id]
                ? "bg-red-50 text-red-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <FiHeart size={12} className={interested[event._id] ? "fill-current" : ""} />
            {interested[event._id] ? "Interested" : "Interested?"}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold mb-2">Community Events</h1>
          <p className="text-blue-100 text-sm">{upcoming.length} upcoming event{upcoming.length !== 1 ? "s" : ""} near you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reminder Notice */}
        {Object.keys(reminders).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-2">
            <FiBell size={14} className="text-yellow-600" />
            <p className="text-sm text-yellow-800 font-medium">
              You have {Object.keys(reminders).length} event reminder{Object.keys(reminders).length > 1 ? "s" : ""} set.
              Notifications will appear in your profile.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
                  Upcoming Events
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcoming.map((ev) => <EventCard key={ev._id} event={ev} />)}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-400 mb-4">Past Events</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {past.map((ev) => <EventCard key={ev._id} event={ev} />)}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <FiCalendar size={48} className="mx-auto mb-4" />
                <p className="font-semibold">No events in this category</p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
}

export default Events;
