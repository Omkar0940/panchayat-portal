import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation } from "../context/LocationContext";
import {
  FiPhone, FiMapPin, FiStar, FiCheckCircle, FiArrowLeft,
  FiNavigation, FiClock, FiShare2
} from "react-icons/fi";

function ProviderDetails() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const { location, getDistance } = useLocation();

  useEffect(() => {
    axios.get(`/api/providers/${id}`)
      .then((r) => { setProvider(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-32">
          <p className="text-gray-500 text-lg">Provider not found.</p>
          <Link to="/providers" className="text-blue-600 mt-4 inline-block">← Back to Providers</Link>
        </div>
      </div>
    );
  }

  const distance =
    location && provider.latitude && provider.longitude
      ? getDistance(location.latitude, location.longitude, provider.latitude, provider.longitude)
      : null;

  const mapsUrl = provider.latitude && provider.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${provider.latitude},${provider.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address || `${provider.area} ${provider.city}`)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/providers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition">
          <FiArrowLeft size={14} /> Back to Providers
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
                  🔧
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold">{provider.name}</h1>
                  <span className="inline-block bg-white/25 px-3 py-0.5 rounded-full text-sm font-medium mt-2">
                    {provider.category}
                  </span>
                </div>
              </div>
              {provider.verified && (
                <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm">
                  <FiCheckCircle size={14} /> Verified
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-2 text-sm">
                <FiStar size={14} className="fill-current text-yellow-300" />
                <span className="font-bold">{provider.rating?.toFixed(1) || "4.0"}</span>
                <span className="text-white/70">Rating</span>
              </div>
              <div className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm ${provider.openNow ? "bg-green-500/25" : "bg-gray-500/25"}`}>
                <FiClock size={14} />
                {provider.openNow ? "Open Now" : "Closed"}
              </div>
              {distance != null && (
                <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-2 text-sm">
                  <FiNavigation size={14} />
                  {distance < 1 ? `${Math.round(distance * 1000)}m away` : `${distance.toFixed(1)}km away`}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMapPin size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Address</p>
                    <p className="text-gray-800 text-sm">{provider.address || `${provider.area}, ${provider.city}`}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiPhone size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Phone</p>
                    <a href={`tel:${provider.phone}`} className="text-gray-800 text-sm hover:text-blue-600">{provider.phone}</a>
                  </div>
                </div>

                {provider.whatsapp && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">💬</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">WhatsApp</p>
                      <a href={`https://wa.me/91${provider.whatsapp}`} target="_blank" rel="noreferrer" className="text-gray-800 text-sm hover:text-green-600">
                        {provider.whatsapp}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Location</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <p><span className="font-medium">Area:</span> {provider.area}</p>
                  <p className="mt-1"><span className="font-medium">City:</span> {provider.city}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <a
                href={`tel:${provider.phone}`}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition"
              >
                <FiPhone size={15} /> Call Now
              </a>

              {provider.whatsapp && (
                <a
                  href={`https://wa.me/91${provider.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm transition"
                >
                  💬 WhatsApp
                </a>
              )}

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition"
              >
                <FiNavigation size={15} /> Directions
              </a>

              <button
                onClick={() => {
                  navigator.share?.({
                    title: provider.name,
                    text: `${provider.category} - ${provider.phone} - ${provider.area}, ${provider.city}`,
                    url: window.location.href,
                  }).catch(() => {
                    navigator.clipboard.writeText(window.location.href);
                  });
                }}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition"
              >
                <FiShare2 size={15} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProviderDetails;
