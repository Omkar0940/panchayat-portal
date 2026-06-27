import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiClock, FiBookmark, FiLogOut, FiCalendar, FiBell } from "react-icons/fi";

function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "view");
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
  });

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    city: user.city || "",
  });

  const savedEvents = (() => {
    try { return JSON.parse(localStorage.getItem("interestedEvents") || "{}"); } catch { return {}; }
  })();

  const reminders = (() => {
    try { return JSON.parse(localStorage.getItem("eventReminders") || "{}"); } catch { return {}; }
  })();

  const savedEventCount = Object.values(savedEvents).filter(Boolean).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const saveProfile = () => {
    const updated = { ...user, ...editForm };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    alert("Profile updated successfully!");
    setActiveTab("view");
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (!user?.name) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <FiUser size={48} className="text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-600">Please log in to view your profile</h2>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const TABS = [
    { id: "view", label: "Profile", icon: FiUser },
    { id: "edit", label: "Edit", icon: FiEdit },
    { id: "history", label: "History", icon: FiClock },
    { id: "saved", label: "Saved Events", icon: FiBookmark },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-8 text-white mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-black backdrop-blur-sm">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">{user.name}</h1>
              <p className="text-blue-100 text-sm mt-0.5">{user.email}</p>
              <span className="inline-block mt-2 bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
                {user.role || "user"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{savedEventCount}</p>
              <p className="text-blue-100 text-xs">Saved Events</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{Object.keys(reminders).length}</p>
              <p className="text-blue-100 text-xs">Reminders</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">0</p>
              <p className="text-blue-100 text-xs">Complaints</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={13} /> {tab.label}
            </button>
          ))}
        </div>

        {/* View Profile */}
        {activeTab === "view" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5">Account Details</h2>
            <div className="space-y-4">
              {[
                { icon: FiUser, label: "Full Name", value: user.name },
                { icon: FiMail, label: "Email", value: user.email },
                { icon: FiPhone, label: "Phone", value: user.phone || "Not set" },
                { icon: FiMapPin, label: "City", value: user.city || "Not set" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => switchTab("edit")} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                <FiEdit size={13} /> Edit Profile
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition">
                <FiLogOut size={13} /> Logout
              </button>
            </div>
          </div>
        )}

        {/* Edit Profile */}
        {activeTab === "edit" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5">Edit Profile</h2>
            <div className="space-y-4">
              {[
                { key: "name", label: "Full Name", icon: FiUser, type: "text" },
                { key: "email", label: "Email", icon: FiMail, type: "email" },
                { key: "phone", label: "Phone", icon: FiPhone, type: "text" },
                { key: "city", label: "City", icon: FiMapPin, type: "text" },
              ].map(({ key, label, icon: Icon, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
                  <div className="relative">
                    <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={type}
                      value={editForm[key]}
                      onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveProfile} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                Save Changes
              </button>
              <button onClick={() => switchTab("view")} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Service History */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <FiClock size={48} className="text-gray-200 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600 mb-1">No Service History Yet</h3>
            <p className="text-sm text-gray-400">Your interactions with providers will appear here</p>
            <Link to="/providers" className="inline-block mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Browse Providers</Link>
          </div>
        )}

        {/* Saved Events */}
        {activeTab === "saved" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <FiBookmark size={16} /> Saved Events & Reminders
            </h2>
            {Object.keys(reminders).length === 0 ? (
              <div className="text-center py-10">
                <FiBell size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No reminders set</p>
                <p className="text-sm text-gray-400 mt-1">Mark events as "Remind" to see them here</p>
                <Link to="/events" className="inline-block mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Browse Events</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(reminders).map(([id, ev]) => (
                  <div key={id} className="flex items-center gap-4 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
                    <FiBell size={16} className="text-yellow-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
                      <p className="text-xs text-gray-500">{new Date(ev.date).toLocaleDateString("en-IN")} • {ev.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
