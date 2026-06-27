function LocationSelector() {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-4xl mx-auto -mt-12 relative z-10">

      <div className="grid md:grid-cols-3 gap-4">

        <select className="border p-3 rounded-lg">
          <option>Select City</option>
          <option>Kolhapur</option>
          <option>Pune</option>
          <option>Mumbai</option>
        </select>

        <select className="border p-3 rounded-lg">
          <option>Select Area</option>
          <option>Rajarampuri</option>
          <option>Shahupuri</option>
          <option>Tarabai Park</option>
        </select>

        <button className="bg-blue-600 text-white rounded-lg">
          Set Location
        </button>

      </div>

    </div>
  );
}

export default LocationSelector;