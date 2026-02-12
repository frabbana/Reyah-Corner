
import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      icon: 'fa-seedling',
      title: 'Pure Ingredients',
      desc: 'Sourced from organic farms globally.'
    },
    {
      icon: 'fa-truck-fast',
      title: 'Fast Delivery',
      desc: 'Free shipping on orders over ৳5000.'
    },
    {
      icon: 'fa-user-doctor',
      title: 'Expert Approved',
      desc: 'Formulated by leading dermatologists.'
    },
    {
      icon: 'fa-recycle',
      title: 'Eco-Friendly',
      desc: 'Recyclable packaging for a greener planet.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center text-sage-dark mb-6 group-hover:scale-110 transition duration-300">
                <i className={`fa-solid ${f.icon} text-2xl`}></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
