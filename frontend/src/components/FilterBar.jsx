const CATEGORIES = [
  "All", "Electrician", "Plumber", "Doctor", "Hospital", "Grocery Store",
  "Pharmacy", "Taxi", "Cable Operator", "Internet Provider",
  "Milk Supplier", "Newspaper Vendor", "Carpenter", "Painter",
  "AC Repair", "Tutor", "Laundry", "Catering", "Other",
];

function FilterBar({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 shadow-sm">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Category</label>
          <select
            value={filters.category || "All"}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Min Rating</label>
          <select
            value={filters.rating || "Any"}
            onChange={(e) => handleChange("rating", e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          >
            <option>Any</option>
            <option value="3">3+ ⭐</option>
            <option value="4">4+ ⭐</option>
            <option value="4.5">4.5+ ⭐</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Distance</label>
          <select
            value={filters.distance || "Any"}
            onChange={(e) => handleChange("distance", e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          >
            <option>Any</option>
            <option value="1">Within 1 km</option>
            <option value="3">Within 3 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Availability</label>
          <select
            value={filters.openNow || "All"}
            onChange={(e) => handleChange("openNow", e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          >
            <option>All</option>
            <option value="yes">Open Now</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
