import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import ProviderCard from "../components/ProviderCard";
import Footer from "../components/Footer";
import AIAssistant from "../components/AIAssistant";
import { useLocation } from "../context/LocationContext";
import { FiSearch, FiLoader, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

function Providers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "All",
    rating: "Any",
    distance: "Any",
    openNow: "All",
  });

  const { location, getDistance } = useLocation();

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filters.category && filters.category !== "All") params.category = filters.category;
      const res = await axios.get("/api/providers", { params });
      setProviders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filters.category]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Update URL params on search/category change
  useEffect(() => {
    const p = {};
    if (search) p.search = search;
    if (filters.category !== "All") p.category = filters.category;
    setSearchParams(p, { replace: true });
  }, [search, filters.category]);

  // Client-side filtering (rating, distance, openNow)
  const getFilteredProviders = () => {
    return providers.filter((p) => {
      if (filters.rating !== "Any") {
        const minRating = parseFloat(filters.rating);
        if ((p.rating || 4.0) < minRating) return false;
      }
      if (filters.openNow === "yes" && p.openNow === false) return false;
      if (filters.distance !== "Any" && location) {
        const maxKm = parseFloat(filters.distance);
        if (p.latitude && p.longitude) {
          const dist = getDistance(location.latitude, location.longitude, p.latitude, p.longitude);
          if (dist != null && dist > maxKm) return false;
        }
      }
      return true;
    });
  };

  const filtered = getFilteredProviders();

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") fetchProviders();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-700 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold mb-2">
            {filters.category !== "All" ? filters.category : "All Providers"}
          </h1>
          <p className="text-blue-100 text-sm">
            {filtered.length} provider{filtered.length !== 1 ? "s" : ""} found
            {filters.category !== "All" ? ` in ${filters.category}` : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search providers by name, category, area..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button
            onClick={fetchProviders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            Search
          </button>
        </div>

        <FilterBar filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader size={32} className="animate-spin text-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FiAlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No providers found</h3>
            <p className="text-gray-400 text-sm mt-1">Try different search terms or filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((provider, i) => {
              const dist =
                location && provider.latitude && provider.longitude
                  ? getDistance(location.latitude, location.longitude, provider.latitude, provider.longitude)
                  : null;
              return (
                <motion.div
                  key={provider._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProviderCard provider={provider} distance={dist} />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
}

export default Providers;
