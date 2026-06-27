import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import { useLocation } from "../context/LocationContext";
import {
  FiHome, FiUsers, FiCalendar, FiAlertTriangle,
  FiPhone, FiUser, FiLogOut, FiEdit, FiClock,
  FiBookmark, FiMenu, FiX, FiMapPin, FiLoader
} from "react-icons/fi";

function Navbar() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const { locationName, detecting, detectLocation } = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [routerLocation.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => routerLocation.pathname === path;

  const navLink = (to, label, icon) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive(to)
          ? "bg-blue-50 text-blue-700"
          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-base">P</span>
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hidden sm:block">
              Panchayat
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLink("/", "Home", <FiHome size={14} />)}
            {navLink("/providers", "Providers", <FiUsers size={14} />)}
            {navLink("/events", "Events", <FiCalendar size={14} />)}
            {navLink("/complaints", "Complaints", <FiAlertTriangle size={14} />)}
            <Link
              to="/emergency"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/emergency")
                  ? "bg-red-50 text-red-700"
                  : "text-red-600 hover:text-red-700 hover:bg-red-50"
              }`}
            >
              <FiPhone size={14} />
              Emergency
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Location Button */}
            <button
              onClick={detectLocation}
              disabled={detecting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition border border-gray-200 max-w-[180px] truncate"
              title={locationName || "Set Location"}
            >
              {detecting ? (
                <FiLoader size={14} className="animate-spin text-blue-500" />
              ) : (
                <FiMapPin size={14} className="text-blue-500 flex-shrink-0" />
              )}
              <span className="truncate text-xs">
                {detecting ? "Detecting..." : locationName || "Set Location"}
              </span>
            </button>

            {!user ? (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition border border-blue-100"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-800 max-w-[100px] truncate">{user.name}</span>
                  <svg className={`w-4 h-4 text-blue-600 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <FiUser size={14} /> View Profile
                    </Link>
                    <Link to="/profile?tab=edit" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <FiEdit size={14} /> Edit Profile
                    </Link>
                    <Link to="/profile?tab=history" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <FiClock size={14} /> Service History
                    </Link>
                    <Link to="/profile?tab=saved" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <FiBookmark size={14} /> Saved Events
                    </Link>
                    {user.role === "admin" && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition">
                        <FiUsers size={14} /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                        <FiLogOut size={14} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiHome size={14} /> Home
          </Link>
          <Link to="/providers" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiUsers size={14} /> Providers
          </Link>
          <Link to="/events" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiCalendar size={14} /> Events
          </Link>
          <Link to="/complaints" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiAlertTriangle size={14} /> Complaints
          </Link>
          <Link to="/emergency" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
            <FiPhone size={14} /> Emergency
          </Link>
          <button
            onClick={detectLocation}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full"
          >
            <FiMapPin size={14} className="text-blue-500" />
            {locationName || "Set Location"}
          </button>
          <div className="pt-2 border-t border-gray-100">
            {!user ? (
              <Link to="/login" className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold">
                Login
              </Link>
            ) : (
              <>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <FiUser size={14} /> {user.name}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full">
                  <FiLogOut size={14} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
