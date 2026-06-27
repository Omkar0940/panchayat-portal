import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation } from "../context/LocationContext";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiSend, FiLoader, FiCheckCircle } from "react-icons/fi";

const COMPLAINT_TYPES = [
  { emoji: "🛣", label: "Road Issues", value: "Road Issues", desc: "Potholes, damaged roads, blocked pathways" },
  { emoji: "💧", label: "Water Supply", value: "Water Supply", desc: "Shortages, leakages, supply disruptions" },
  { emoji: "💡", label: "Street Lights", value: "Street Lights", desc: "Damaged or non-functional street lights" },
  { emoji: "🗑", label: "Garbage Collection", value: "Garbage Collection", desc: "Waste management and cleanliness issues" },
  { emoji: "⚡", label: "Electricity", value: "Electricity", desc: "Power outages and electrical issues" },
  { emoji: "🌿", label: "Sanitation", value: "Sanitation", desc: "Drainage, sewage and sanitation issues" },
  { emoji: "🌳", label: "Parks & Trees", value: "Parks & Trees", desc: "Public park maintenance and tree issues" },
  { emoji: "📋", label: "Other", value: "Other", desc: "Any other community-related concerns" },
];

function Complaints() {
  const [formData, setFormData] = useState({ name: "", phone: "", category: "", description: "", location: "" });
  const [selectedType, setSelectedType] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { locationName } = useLocation();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const selectType = (value) => {
    setSelectedType(value);
    setFormData({ ...formData, category: value, location: formData.location || locationName || "" });
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await axios.post("/api/complaints", formData);
      setMessage({ text: "Complaint submitted successfully! We'll look into it shortly.", type: "success" });
      setFormData({ name: "", phone: "", category: "", description: "", location: "" });
      setSelectedType("");
      setStep(1);
    } catch {
      setMessage({ text: "Failed to submit complaint. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-br from-blue-700 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <FiAlertTriangle size={24} />
            <h1 className="text-3xl font-extrabold">Complaints Portal</h1>
          </div>
          <p className="text-blue-100 text-sm">Report local issues and help improve your community</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 px-5 py-4 rounded-xl text-sm font-medium flex items-center gap-3 ${
              message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <FiCheckCircle size={16} />
            {message.text}
          </motion.div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Select Complaint Category</h2>
            <p className="text-gray-500 text-sm mb-6">Choose the type of issue you want to report</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COMPLAINT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => selectType(type.value)}
                  className="group bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{type.emoji}</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{type.label}</h3>
                  <p className="text-xs text-gray-500">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-1">
              ← Back to Categories
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">{COMPLAINT_TYPES.find(t => t.value === selectedType)?.emoji}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedType}</h2>
                  <p className="text-sm text-gray-500">Fill in the details below</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Your Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Phone Number *</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Contact number" required className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the issue in detail..."
                    required
                    rows={4}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Street address or landmark"
                    required
                    className={inputClass}
                  />
                  {locationName && (
                    <p className="text-xs text-blue-500 mt-1">Auto-detected: {locationName}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition"
                >
                  {loading ? <FiLoader size={15} className="animate-spin" /> : <FiSend size={15} />}
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Complaints;
