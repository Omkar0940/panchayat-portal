import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation } from "../context/LocationContext";
import { FiSearch, FiMapPin, FiLoader } from "react-icons/fi";

const quickServices = [
  { label: "⚡ Electrician", q: "Electrician" },
  { label: "🚰 Plumber", q: "Plumber" },
  { label: "🏥 Hospital", q: "Hospital" },
  { label: "🛒 Grocery", q: "Grocery" },
  { label: "🚕 Taxi", q: "Taxi" },
  { label: "👨‍⚕️ Doctor", q: "Doctor" },
];

function Hero() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { locationName, detecting, detectLocation } = useLocation();

  const handleSearch = (q) => {
    const term = q || search;
    if (term.trim()) {
      navigate(`/providers?search=${encodeURIComponent(term.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white">
      {/* Decorative */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full text-sm backdrop-blur-md mb-6">
            <FiMapPin size={14} />
            {locationName ? `Showing results near ${locationName}` : "Serving Your Nearby Community"}
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Discover Trusted
            <br />
            <span className="text-cyan-300">Local Services</span> Near You
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mt-6 max-w-2xl mx-auto">
            Find verified electricians, plumbers, doctors, grocery stores, community
            events, and emergency contacts — all based on your location.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4">
              <FiSearch size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search Plumber, Hospital, Grocery..."
                className="flex-1 py-3 outline-none text-gray-700 text-base placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2 sm:flex-shrink-0">
              <button
                onClick={detectLocation}
                disabled={detecting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 transition text-white px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap"
              >
                {detecting ? <FiLoader size={16} className="animate-spin" /> : <FiMapPin size={16} />}
                {locationName ? "Update" : "Set Location"}
              </button>
              <button
                onClick={() => handleSearch()}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-semibold text-sm"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick Services */}
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            {quickServices.map((s) => (
              <button
                key={s.q}
                onClick={() => handleSearch(s.q)}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-medium transition border border-white/20"
              >
                {s.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14"
        >
          {[
            { value: "500+", label: "Providers" },
            { value: "50+", label: "Categories" },
            { value: "1000+", label: "Users" },
            { value: "24×7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/15 backdrop-blur-lg rounded-2xl p-5 text-center border border-white/10">
              <h2 className="text-3xl font-bold">{stat.value}</h2>
              <p className="text-blue-100 mt-1 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
