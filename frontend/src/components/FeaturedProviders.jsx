function FeaturedProviders() {

  const providers = [
    {
      name: "ABC Cable Network",
      category: "Cable Operator"
    },
    {
      name: "QuickFix Plumbing",
      category: "Plumber"
    },
    {
      name: "SmartNet Internet",
      category: "Internet Provider"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-6">

      <h2 className="text-4xl font-bold text-center mb-12">
        Featured Providers
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        {providers.map((provider, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-8"
          >
            <h3 className="font-bold text-xl mb-2">
              {provider.name}
            </h3>

            <p className="text-gray-500">
              {provider.category}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default FeaturedProviders;