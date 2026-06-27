import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  FiGrid, FiUsers, FiAlertTriangle, FiCalendar, FiPhone,
  FiPlus, FiTrash2, FiLoader, FiCheckCircle,
  FiLock, FiEye, FiEyeOff, FiShield, FiLogOut
} from "react-icons/fi";

const ADMIN_PASSWORD = "panchayat@admin2024";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid },
  { id: "providers", label: "Providers", icon: FiUsers },
  { id: "complaints", label: "Complaints", icon: FiAlertTriangle },
  { id: "events", label: "Events", icon: FiCalendar },
  { id: "emergency", label: "Emergency", icon: FiPhone },
];

const inputClass = "w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50";
const CATEGORIES = ["Electrician", "Plumber", "Doctor", "Hospital", "Pharmacy", "Grocery Store", "Taxi", "Cable Operator", "Internet Provider", "Milk Supplier", "Newspaper Vendor", "Carpenter", "Painter", "AC Repair", "Tutor", "Laundry", "Catering", "Other"];
const EMERGENCY_TYPES = ["Hospital", "Ambulance", "Doctor", "Police", "Fire Station", "Blood Bank", "Pharmacy", "Municipal Office", "Other"];
const EVENT_CATEGORIES = ["General", "Health", "Environment", "Community", "Education", "Sports", "Cultural"];

function Admin() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("admin_unlocked") === "yes");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showPin, setShowPin] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [providers, setProviders] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [events, setEvents] = useState([]);
  const [emergency, setEmergency] = useState([]);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const [providerForm, setProviderForm] = useState({ name: "", category: "Electrician", phone: "", address: "", city: "", area: "", latitude: "", longitude: "", rating: "4.0", verified: false, openNow: true });
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", time: "10:00 AM", location: "", category: "General", organizer: "Gram Panchayat", city: "" });
  const [emergencyForm, setEmergencyForm] = useState({ name: "", type: "Hospital", phone: "", phone2: "", address: "", city: "", area: "", available24x7: false });

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const load = async () => {
    try {
      const [p, c, ev, em] = await Promise.all([
        axios.get("/api/providers"),
        axios.get("/api/complaints"),
        axios.get("/api/events"),
        axios.get("/api/emergency"),
      ]);
      setProviders(p.data);
      setComplaints(c.data);
      setEvents(ev.data);
      setEmergency(em.data);
    } catch { /* silent */ }
  };

  useEffect(() => {
    if (unlocked) load();
  }, [unlocked]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_unlocked", "yes");
      setUnlocked(true);
      setPinError("");
    } else {
      setPinError("Incorrect password. Please try again.");
      setPin("");
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem("admin_unlocked");
    setUnlocked(false);
    setPin("");
  };

  const addProvider = async () => {
    setLoading(true);
    try {
      const data = { ...providerForm, latitude: Number(providerForm.latitude) || undefined, longitude: Number(providerForm.longitude) || undefined, rating: Number(providerForm.rating) };
      await axios.post("/api/providers", data);
      showMsg("Provider added successfully!");
      setProviderForm({ name: "", category: "Electrician", phone: "", address: "", city: "", area: "", latitude: "", longitude: "", rating: "4.0", verified: false, openNow: true });
      load();
    } catch { showMsg("Failed to add provider", "error"); }
    setLoading(false);
  };

  const deleteProvider = async (id) => {
    if (!confirm("Delete this provider?")) return;
    await axios.delete(`/api/providers/${id}`);
    load();
  };

  const addEvent = async () => {
    setLoading(true);
    try {
      await axios.post("/api/events", eventForm);
      showMsg("Event added successfully!");
      setEventForm({ title: "", description: "", date: "", time: "10:00 AM", location: "", category: "General", organizer: "Gram Panchayat", city: "" });
      load();
    } catch { showMsg("Failed to add event", "error"); }
    setLoading(false);
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    await axios.delete(`/api/events/${id}`);
    load();
  };

  const addEmergency = async () => {
    setLoading(true);
    try {
      await axios.post("/api/emergency", emergencyForm);
      showMsg("Emergency contact added!");
      setEmergencyForm({ name: "", type: "Hospital", phone: "", phone2: "", address: "", city: "", area: "", available24x7: false });
      load();
    } catch { showMsg("Failed to add emergency contact", "error"); }
    setLoading(false);
  };

  const deleteEmergency = async (id) => {
    if (!confirm("Delete this emergency contact?")) return;
    await axios.delete(`/api/emergency/${id}`);
    load();
  };

  const updateComplaint = async (id, status) => {
    await axios.put(`/api/complaints/${id}`, { status });
    load();
  };

  const statusBadge = (status) => {
    const map = { Pending: "bg-yellow-100 text-yellow-700", "In Progress": "bg-blue-100 text-blue-700", Resolved: "bg-green-100 text-green-700" };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <FiShield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Admin Access</h1>
            <p className="text-gray-400 text-sm mt-1">This area is restricted. Enter your password.</p>
          </div>

          <form onSubmit={handleUnlock} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
            {pinError && (
              <div className="mb-4 bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-xl">
                {pinError}
              </div>
            )}
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Admin Password</label>
            <div className="relative mb-4">
              <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPin ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <FiLock size={14} /> Unlock Admin Panel
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-6">
            Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiShield size={16} className="text-green-400" />
              <span className="text-green-400 text-xs font-semibold uppercase tracking-wide">Secured Access</span>
            </div>
            <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Manage all platform data from one place</p>
          </div>
          <button
            onClick={handleLock}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            <FiLogOut size={14} /> Lock Panel
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {msg.text && (
          <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            <FiCheckCircle size={14} /> {msg.text}
          </div>
        )}

        {/* Tab Nav */}
        <div className="flex gap-2 flex-wrap mb-8 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === tab.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Providers", count: providers.length, color: "from-blue-500 to-blue-600", icon: "🏢" },
                { label: "Complaints", count: complaints.length, color: "from-orange-500 to-red-500", icon: "📋" },
                { label: "Events", count: events.length, color: "from-green-500 to-emerald-600", icon: "📅" },
                { label: "Emergency", count: emergency.length, color: "from-red-500 to-rose-600", icon: "🚨" },
              ].map((s) => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} text-white rounded-2xl p-5`}>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <p className="text-3xl font-extrabold">{s.count}</p>
                  <p className="text-sm opacity-80 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Recent Complaints</h3>
              {complaints.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No complaints yet</p>
              ) : complaints.slice(0, 5).map((c) => (
                <div key={c._id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.category}</p>
                    <p className="text-xs text-gray-400">{c.name} — {c.location}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge(c.status)}`}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROVIDERS */}
        {activeTab === "providers" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiPlus size={16} /> Add New Provider</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input value={providerForm.name} onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })} placeholder="Provider Name *" className={inputClass} />
                <select value={providerForm.category} onChange={(e) => setProviderForm({ ...providerForm, category: e.target.value })} className={inputClass}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input value={providerForm.phone} onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })} placeholder="Phone *" className={inputClass} />
                <input value={providerForm.address} onChange={(e) => setProviderForm({ ...providerForm, address: e.target.value })} placeholder="Address" className={inputClass} />
                <input value={providerForm.city} onChange={(e) => setProviderForm({ ...providerForm, city: e.target.value })} placeholder="City *" className={inputClass} />
                <input value={providerForm.area} onChange={(e) => setProviderForm({ ...providerForm, area: e.target.value })} placeholder="Area *" className={inputClass} />
                <input value={providerForm.latitude} onChange={(e) => setProviderForm({ ...providerForm, latitude: e.target.value })} placeholder="Latitude (optional, for distance)" className={inputClass} />
                <input value={providerForm.longitude} onChange={(e) => setProviderForm({ ...providerForm, longitude: e.target.value })} placeholder="Longitude (optional, for distance)" className={inputClass} />
                <input type="number" min="1" max="5" step="0.1" value={providerForm.rating} onChange={(e) => setProviderForm({ ...providerForm, rating: e.target.value })} placeholder="Rating (1–5)" className={inputClass} />
              </div>
              <div className="flex gap-4 mt-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={providerForm.verified} onChange={(e) => setProviderForm({ ...providerForm, verified: e.target.checked })} className="rounded" />
                  Verified
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={providerForm.openNow} onChange={(e) => setProviderForm({ ...providerForm, openNow: e.target.checked })} className="rounded" />
                  Open Now
                </label>
              </div>
              <button onClick={addProvider} disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition">
                {loading ? <FiLoader size={14} className="animate-spin" /> : <FiPlus size={14} />}
                Add Provider
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">All Providers ({providers.length})</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {providers.length === 0 ? (
                  <p className="p-6 text-gray-400 text-sm text-center">No providers yet — add one above</p>
                ) : providers.map((p) => (
                  <div key={p._id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.category} • {p.area}, {p.city} • {p.phone}</p>
                    </div>
                    <button onClick={() => deleteProvider(p._id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition flex-shrink-0">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMPLAINTS */}
        {activeTab === "complaints" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">All Complaints ({complaints.length})</h2>
            </div>
            {complaints.length === 0 ? (
              <p className="p-8 text-gray-400 text-sm text-center">No complaints submitted yet</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {complaints.map((c) => (
                  <div key={c._id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{c.category}</span>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{c.description?.substring(0, 100)}{c.description?.length > 100 ? "..." : ""}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.name} • {c.phone} • {c.location}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusBadge(c.status)}`}>{c.status}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {["Pending", "In Progress", "Resolved"].map((s) => (
                        <button key={s} onClick={() => updateComplaint(c._id, s)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${c.status === s ? "opacity-40 cursor-default" : "hover:opacity-80"} ${statusBadge(s)}`}
                          disabled={c.status === s}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EVENTS */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiPlus size={16} /> Add New Event</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Event Title *" className={inputClass} />
                <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className={inputClass} />
                <input value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} placeholder="Time (e.g. 10:00 AM)" className={inputClass} />
                <input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Location *" className={inputClass} />
                <input value={eventForm.city} onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })} placeholder="City *" className={inputClass} />
                <input value={eventForm.organizer} onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })} placeholder="Organizer" className={inputClass} />
                <select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} className={inputClass}>
                  {EVENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Description" rows={2} className={`${inputClass} col-span-full sm:col-span-2`} />
              </div>
              <button onClick={addEvent} disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition">
                {loading ? <FiLoader size={14} className="animate-spin" /> : <FiPlus size={14} />}
                Add Event
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">All Events ({events.length})</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {events.length === 0 ? (
                  <p className="p-6 text-gray-400 text-sm text-center">No events yet — add one above</p>
                ) : events.map((ev) => (
                  <div key={ev._id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
                      <p className="text-xs text-gray-400">{new Date(ev.date).toLocaleDateString("en-IN")} • {ev.location} • {ev.category}</p>
                    </div>
                    <button onClick={() => deleteEvent(ev._id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition flex-shrink-0">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EMERGENCY */}
        {activeTab === "emergency" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiPlus size={16} /> Add Emergency Contact</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input value={emergencyForm.name} onChange={(e) => setEmergencyForm({ ...emergencyForm, name: e.target.value })} placeholder="Name *" className={inputClass} />
                <select value={emergencyForm.type} onChange={(e) => setEmergencyForm({ ...emergencyForm, type: e.target.value })} className={inputClass}>
                  {EMERGENCY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <input value={emergencyForm.phone} onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })} placeholder="Primary Phone *" className={inputClass} />
                <input value={emergencyForm.phone2} onChange={(e) => setEmergencyForm({ ...emergencyForm, phone2: e.target.value })} placeholder="Secondary Phone" className={inputClass} />
                <input value={emergencyForm.address} onChange={(e) => setEmergencyForm({ ...emergencyForm, address: e.target.value })} placeholder="Address *" className={inputClass} />
                <input value={emergencyForm.city} onChange={(e) => setEmergencyForm({ ...emergencyForm, city: e.target.value })} placeholder="City *" className={inputClass} />
                <input value={emergencyForm.area} onChange={(e) => setEmergencyForm({ ...emergencyForm, area: e.target.value })} placeholder="Area" className={inputClass} />
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer col-span-full sm:col-span-1">
                  <input type="checkbox" checked={emergencyForm.available24x7} onChange={(e) => setEmergencyForm({ ...emergencyForm, available24x7: e.target.checked })} className="rounded" />
                  Available 24×7
                </label>
              </div>
              <button onClick={addEmergency} disabled={loading} className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition">
                {loading ? <FiLoader size={14} className="animate-spin" /> : <FiPlus size={14} />}
                Add Contact
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Emergency Contacts ({emergency.length})</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {emergency.length === 0 ? (
                  <p className="p-6 text-gray-400 text-sm text-center">No emergency contacts yet — add one above</p>
                ) : emergency.map((em) => (
                  <div key={em._id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{em.name}</p>
                      <p className="text-xs text-gray-400">{em.type} • {em.phone} • {em.area || em.city}</p>
                    </div>
                    <button onClick={() => deleteEmergency(em._id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition flex-shrink-0">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
