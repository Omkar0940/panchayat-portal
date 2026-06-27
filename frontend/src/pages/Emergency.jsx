import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIAssistant from "../components/AIAssistant";
import { useLocation } from "../context/LocationContext";
import { motion } from "framer-motion";
import { FiPhone, FiMapPin, FiClock, FiNavigation, FiSearch } from "react-icons/fi";

const TYPE_ICONS = {
  Hospital: { icon: "🏥", color: "from-red-500 to-rose-600", bg: "bg-red-50", text: "text-red-700" },
  Ambulance: { icon: "🚑", color: "from-orange-500 to-red-500", bg: "bg-orange-50", text: "text-orange-700" },
  Doctor: { icon: "👨‍⚕️", color: "from-green-500 to-emerald-600", bg: "bg-green-50", text: "text-green-700" },
  Police: { icon: "🚔", color: "from-blue-600 to-blue-700", bg: "bg-blue-50", text: "text-blue-700" },
  "Fire Station": { icon: "🚒", color: "from-orange-600 to-red-600", bg: "bg-orange-50", text: "text-orange-700" },
  "Blood Bank": { icon: "🩸", color: "from-red-600 to-pink-600", bg: "bg-red-50", text: "text-red-700" },
  Pharmacy: { icon: "💊", color: "from-purple-500 to-violet-600", bg: "bg-purple-50", text: "text-purple-700" },
  "Municipal Office": { icon: "🏛", color: "from-gray-600 to-gray-700", bg: "bg-gray-50", text: "text-gray-700" },
  Other: { icon: "📞", color: "from-cyan-500 to-blue-500", bg: "bg-cyan-50", text: "text-cyan-700" },
};

const TYPES = ["All", "Hospital", "Ambulance", "Doctor", "Police", "Fire Station", "Blood Bank", "Pharmacy", "Municipal Office", "Other"];

const STATIC_CONTACTS = [
  { name: "National Emergency", type: "Other", phone: "112", address: "India-wide", city: "National", available24x7: true },
  { name: "Police", type: "Police", phone: "100", address: "India-wide", city: "National", available24x7: true },
  { name: "Fire Brigade", type: "Fire Station", phone: "101", address: "India-wide", city: "National", available24x7: true },
  { name: "Ambulance", type: "Ambulance", phone: "108", address: "India-wide", city: "National", available24x7: true },
  { name: "Women Helpline", type: "Other", phone: "1091", address: "India-wide", city: "National", available24x7: true },
  { name: "Child Helpline", type: "Other", phone: "1098", address: "India-wide", city: "National", available24x7: true },
];

function Emergency() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");
  const { location, getDistance } = useLocation();

  useEffect(() => {
    axios.get("/api/emergency")
      .then((r) => { setContacts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const all = [...STATIC_CONTACTS, ...contacts];

  const filtered = all.filter((c) => {
    if (activeType !== "All" && c.type !== activeType) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q);
    }
    return true;
  });

  const groupedByType = TYPES.filter(t => t !== "All").reduce((acc, type) => {
    const items = filtered.filter(c => c.type === type);
    if (items.length) acc[type] = items;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-red-700 to-rose-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🚨</span>
            <h1 className="text-3xl font-extrabold">Emergency Information</h1>
          </div>
          <p className="text-red-100 text-sm mt-1">Quick access to all emergency services near you</p>

          {/* Quick Dials */}
          <div className="flex flex-wrap gap-3 mt-6">
            {STATIC_CONTACTS.slice(0, 4).map((c) => (
              <a
                key={c.name}
                href={`tel:${c.phone}`}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm font-semibold transition border border-white/20"
              >
                {TYPE_ICONS[c.type]?.icon} {c.name}: {c.phone}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospitals, police, blood banks..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            />
          </div>
          <select
            value={activeType}
            onChange={(e) => setActiveType(e.target.value)}
            className="border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          >
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Type Filter Chips */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                activeType === t ? "bg-red-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {t !== "All" && TYPE_ICONS[t]?.icon} {t}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeType !== "All" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((contact, i) => <ContactCard key={i} contact={contact} location={location} getDistance={getDistance} />)}
          </div>
        ) : (
          Object.entries(groupedByType).map(([type, items]) => (
            <div key={type} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{TYPE_ICONS[type]?.icon}</span>
                <h2 className="text-lg font-bold text-gray-900">{type}</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((contact, i) => <ContactCard key={i} contact={contact} location={location} getDistance={getDistance} />)}
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
}

function ContactCard({ contact, location, getDistance }) {
  const meta = TYPE_ICONS[contact.type] || TYPE_ICONS.Other;
  const distance =
    location && contact.latitude && contact.longitude
      ? getDistance(location.latitude, location.longitude, contact.latitude, contact.longitude)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${meta.color} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.icon}</span>
            <div>
              <p className="font-bold text-sm leading-tight">{contact.name}</p>
              <p className="text-xs opacity-80">{contact.type}</p>
            </div>
          </div>
          {contact.available24x7 && (
            <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <FiClock size={10} /> 24×7
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-green-600 transition">
          <FiPhone size={13} className="text-green-500" /> {contact.phone}
        </a>
        {contact.phone2 && (
          <a href={`tel:${contact.phone2}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition">
            <FiPhone size={13} className="text-green-400" /> {contact.phone2}
          </a>
        )}
        {contact.address && contact.city !== "National" && (
          <p className="flex items-start gap-2 text-xs text-gray-500">
            <FiMapPin size={11} className="mt-0.5 flex-shrink-0" />
            <span>{contact.address}{contact.city && `, ${contact.city}`}</span>
          </p>
        )}
        {distance != null && (
          <p className="flex items-center gap-1 text-xs text-blue-500">
            <FiNavigation size={11} />
            {distance < 1 ? `${Math.round(distance * 1000)}m away` : `${distance.toFixed(1)}km away`}
          </p>
        )}
      </div>

      <div className="px-4 pb-4">
        <a
          href={`tel:${contact.phone}`}
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition"
        >
          📞 Call Now
        </a>
      </div>
    </motion.div>
  );
}

export default Emergency;
