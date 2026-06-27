import { useNavigate } from "react-router-dom";

const categories = [
  { title: "Electrician", icon: "⚡", slug: "Electrician", color: "from-yellow-400 to-orange-400" },
  { title: "Plumber", icon: "🚰", slug: "Plumber", color: "from-blue-400 to-cyan-400" },
  { title: "Doctor", icon: "👨‍⚕️", slug: "Doctor", color: "from-green-400 to-emerald-400" },
  { title: "Hospital", icon: "🏥", slug: "Hospital", color: "from-red-400 to-pink-400" },
  { title: "Grocery Store", icon: "🛒", slug: "Grocery Store", color: "from-orange-400 to-amber-400" },
  { title: "Pharmacy", icon: "💊", slug: "Pharmacy", color: "from-purple-400 to-violet-400" },
  { title: "Taxi", icon: "🚕", slug: "Taxi", color: "from-cyan-400 to-blue-400" },
  { title: "Carpenter", icon: "🪚", slug: "Carpenter", color: "from-amber-400 to-yellow-400" },
  { title: "Cable Operator", icon: "📡", slug: "Cable Operator", color: "from-indigo-400 to-purple-400" },
  { title: "Internet Provider", icon: "📶", slug: "Internet Provider", color: "from-sky-400 to-blue-400" },
  { title: "Milk Supplier", icon: "🥛", slug: "Milk Supplier", color: "from-slate-300 to-gray-400" },
  { title: "Catering", icon: "🍽️", slug: "Catering", color: "from-rose-400 to-red-400" },
];

function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900">Explore Services</h2>
        <p className="mt-3 text-gray-500 text-base">Find trusted professionals in every category near you</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((item) => (
          <button
            key={item.slug}
            onClick={() => navigate(`/providers?category=${encodeURIComponent(item.slug)}`)}
            className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{item.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;
