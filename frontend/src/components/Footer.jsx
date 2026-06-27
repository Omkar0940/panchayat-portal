import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-base">P</span>
              </div>
              <span className="text-xl font-extrabold text-white">Panchayat</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Everything around you, one search away. Connecting communities with trusted local services since 2024.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
              <FiPhone size={13} /> <span>1800-PANCHAYAT</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <FiMail size={13} /> <span>support@panchayat.in</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                ["/", "Home"],
                ["/providers", "Providers"],
                ["/events", "Events"],
                ["/complaints", "Complaints"],
                ["/emergency", "Emergency Info"],
              ].map(([path, label]) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-400 hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Emergency</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>🚔 Police: 100</li>
              <li>🚒 Fire: 101</li>
              <li>🚑 Ambulance: 108</li>
              <li>🆘 Emergency: 112</li>
              <li>👩 Women Helpline: 1091</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">© 2026 Panchayat. All rights reserved.</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <FiMapPin size={11} /> Kolhapur, Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
