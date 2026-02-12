
import React, { useRef } from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full mb-12 relative group">
      {/* Left Navigation Arrow */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-navy hover:text-gold transition-all active:scale-90 md:opacity-0 group-hover:opacity-100"
        aria-label="Scroll categories left"
      >
        <i className="fa-solid fa-chevron-left text-xs"></i>
      </button>

      {/* Categories Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center space-x-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x px-12"
      >
        <button
          onClick={() => onSelectCategory('All')}
          className={`flex-shrink-0 px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 snap-center ${
            selectedCategory === 'All'
              ? 'bg-navy text-gold shadow-xl scale-105'
              : 'bg-white text-navy border border-gray-100 hover:border-gold hover:text-gold'
          }`}
        >
          All Collection
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`flex-shrink-0 px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 snap-center ${
              selectedCategory === category
                ? 'bg-navy text-gold shadow-xl scale-105'
                : 'bg-white text-navy border border-gray-100 hover:border-gold hover:text-gold'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Right Navigation Arrow */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-navy hover:text-gold transition-all active:scale-90 md:opacity-0 group-hover:opacity-100"
        aria-label="Scroll categories right"
      >
        <i className="fa-solid fa-chevron-right text-xs"></i>
      </button>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;
