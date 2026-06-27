import {
  FaWrench,
  FaBolt,
  FaWifi,
  FaShoppingCart,
  FaNewspaper,
  FaTv
} from "react-icons/fa";

const services = [
  { icon: <FaWrench />, title: "Plumber" },
  { icon: <FaBolt />, title: "Electrician" },
  { icon: <FaWifi />, title: "Internet" },
  { icon: <FaShoppingCart />, title: "Grocery" },
  { icon: <FaNewspaper />, title: "Newspaper" },
  { icon: <FaTv />, title: "Cable TV" }
];

function Categories() {
  return (
    <section className="max-w-7xl mx-auto py-20 px-6">

      <h2 className="text-4xl font-bold text-center mb-10">
        Popular Services
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-8 text-center hover:scale-105 transition"
          >
            <div className="text-5xl text-blue-600 mb-4">
              {service.icon}
            </div>

            <h3 className="font-bold text-xl">
              {service.title}
            </h3>
          </div>
        ))}

      </div>

    </section>
  );
}

export default Categories;