import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import Footer from "../components/Footer";
import AIAssistant from "../components/AIAssistant";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiArrowRight, FiPhone } from "react-icons/fi";

function Home() {
  const [events, setEvents] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    axios.get("/api/events").then((r) => setEvents(r.data.slice(0, 3))).catch(() => {});
    axios.get("/api/providers").then((r) => setProviders(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch { return d; }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <CategoryGrid />

      {/* Featured Providers */}
      {providers.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Featured Providers</h2>
              <p className="text-gray-500 text-sm mt-1">Top-rated professionals near you</p>
            </div>
            <Link to="/providers" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map((p) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl">🔧</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
                    <span className="text-xs text-blue-600 font-medium">{p.category}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><FiMapPin size={11} /> {p.area}, {p.city}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><FiPhone size={11} /> {p.phone}</p>
                <div className="flex gap-2 mt-4">
                  <a href={`tel:${p.phone}`} className="flex-1 text-center bg-green-50 text-green-700 text-xs font-semibold py-2 rounded-lg hover:bg-green-100 transition">Call</a>
                  <Link to={`/providers/${p._id}`} className="flex-1 text-center bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-700 transition">Details</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Upcoming Events</h2>
                <p className="text-gray-500 text-sm mt-1">Community activities near you</p>
              </div>
              <Link to="/events" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((ev) => (
                <div key={ev._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiCalendar size={18} className="text-blue-600" />
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{ev.category}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{ev.title}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><FiCalendar size={11} /> {formatDate(ev.date)} {ev.time && `• ${ev.time}`}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><FiMapPin size={11} /> {ev.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Emergency Quick Access */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-3xl p-8 md:p-12 text-white text-center">
          <div className="text-4xl mb-4">🚨</div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Need Emergency Help?</h2>
          <p className="text-red-100 mb-8 text-sm md:text-base">Quick access to nearby hospitals, police, ambulance, and more</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[["🚔", "Police", "100"], ["🚒", "Fire", "101"], ["🚑", "Ambulance", "108"], ["🆘", "Emergency", "112"], ["👩", "Women Helpline", "1091"]].map(([icon, label, num]) => (
              <a key={num} href={`tel:${num}`} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm font-semibold transition">
                {icon} {label}: {num}
              </a>
            ))}
          </div>
          <Link to="/emergency" className="inline-block bg-white text-red-600 font-bold px-8 py-3 rounded-xl hover:bg-red-50 transition shadow-lg">
            View All Emergency Contacts
          </Link>
        </div>
      </section>

      <Footer />
      <AIAssistant />
    </div>
  );
}

export default Home;
