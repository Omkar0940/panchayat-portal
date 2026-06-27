import { Link } from "react-router-dom";
import { FiPhone, FiMapPin, FiStar, FiCheckCircle, FiNavigation } from "react-icons/fi";

const categoryColors = {
  Electrician: "bg-yellow-100 text-yellow-700",
  Plumber: "bg-blue-100 text-blue-700",
  Doctor: "bg-green-100 text-green-700",
  Hospital: "bg-red-100 text-red-700",
  Pharmacy: "bg-purple-100 text-purple-700",
  Grocery: "bg-orange-100 text-orange-700",
  Taxi: "bg-cyan-100 text-cyan-700",
};

const categoryIcons = {
  Electrician: "⚡",
  Plumber: "🚰",
  Doctor: "👨‍⚕️",
  Hospital: "🏥",
  Pharmacy: "💊",
  "Grocery Store": "🛒",
  Taxi: "🚕",
  Carpenter: "🪚",
  Painter: "🎨",
  "AC Repair": "❄️",
  Tutor: "📚",
  Catering: "🍽️",
  Laundry: "👕",
};

function ProviderCard({ provider, distance }) {
  const colorClass = categoryColors[provider.category] || "bg-gray-100 text-gray-700";
  const icon = categoryIcons[provider.category] || "🔧";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-2xl flex-shrink-0">
              {icon}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight line-clamp-1">
                {provider.name}
              </h2>
              <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
                {provider.category}
              </span>
            </div>
          </div>
          {provider.verified && (
            <FiCheckCircle size={16} className="text-green-500 flex-shrink-0 mt-1" title="Verified" />
          )}
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 text-amber-500">
            <FiStar size={13} className="fill-current" />
            <span className="text-xs font-bold text-gray-700">{provider.rating?.toFixed(1) || "4.0"}</span>
          </div>
          {provider.openNow !== undefined && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${provider.openNow ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {provider.openNow ? "Open" : "Closed"}
            </span>
          )}
          {distance != null && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FiNavigation size={11} />
              {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 pt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiMapPin size={13} className="text-gray-400 flex-shrink-0" />
          <span className="line-clamp-1">{provider.area}, {provider.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiPhone size={13} className="text-gray-400 flex-shrink-0" />
          <span>{provider.phone}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex gap-2">
        <a
          href={`tel:${provider.phone}`}
          className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold py-2.5 rounded-xl text-center transition"
        >
          Call
        </a>
        <Link
          to={`/providers/${provider._id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl text-center transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProviderCard;
