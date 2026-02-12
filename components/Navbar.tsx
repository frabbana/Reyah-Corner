import React, { useState, useRef, useEffect } from 'react';
import { User, Product } from '../types';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onConsultantClick: () => void;
  onHomeClick: () => void;
  onShopClick: (e: React.MouseEvent) => void;
  currentUser: User | null;
  onUserClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allProducts: Product[];
  onViewProduct: (product: Product) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onCartClick, 
  onConsultantClick, 
  onHomeClick,
  onShopClick,
  currentUser,
  onUserClick,
  searchQuery,
  onSearchChange,
  allProducts,
  onViewProduct
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredPreview = allProducts
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass-effect border-b border-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24 gap-2 md:gap-4">
          
          {/* 1. Logo Section (Far Left) */}
          <div className="flex-shrink-0">
            <button 
              onClick={onHomeClick} 
              className="flex items-center space-x-2 md:space-x-3 group transition-transform active:scale-95"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 logo-premium rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-navy opacity-90 group-hover:bg-[#00235a] transition-colors"></div>
                <span className="relative text-white font-serif text-lg md:text-2xl font-bold tracking-tighter">RC</span>
                <div className="absolute bottom-0 right-0 w-2 h-2 md:w-4 md:h-4 bg-gold rounded-tl-lg"></div>
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-lg font-bold tracking-[0.1em] text-navy leading-none">REYAH</span>
                <span className="block text-[8px] font-bold tracking-[0.4em] text-gold uppercase mt-1">Corner</span>
              </div>
            </button>
          </div>

          {/* 2. Left Nav Links (Left of Search - Desktop Only) */}
          <div className="hidden lg:flex items-center space-x-6">
            <button 
              onClick={onHomeClick}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-navy hover:text-gold transition-colors"
            >
              Home
            </button>
            <button 
              onClick={onShopClick}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-navy hover:text-gold transition-colors whitespace-nowrap"
            >
              Shop Collection
            </button>
          </div>

          {/* 3. Smart Search Bar (Center - Responsive) */}
          <div ref={searchRef} className="flex flex-1 max-w-[200px] sm:max-w-sm relative">
            <div className="relative w-full group">
              <i className="fa-solid fa-magnifying-glass absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors text-[10px] md:text-xs"></i>
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowDropdown(true);
                }}
                className="w-full bg-gray-50/50 border border-gray-100 py-2 md:py-2.5 pl-9 md:pl-12 pr-9 md:pr-12 rounded-full outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all text-[10px] md:text-xs font-medium text-navy placeholder:text-gray-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-gray-400 hover:text-navy transition"
                >
                  <i className="fa-solid fa-circle-xmark text-[10px] md:text-xs"></i>
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {showDropdown && searchQuery && (
              <div className="absolute top-full left-[-50px] sm:left-0 right-[-50px] sm:right-0 mt-3 bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-3 md:p-4 border-b border-gray-50">
                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Quick Results</p>
                </div>
                <div className="max-h-60 md:max-h-80 overflow-y-auto">
                  {filteredPreview.length > 0 ? (
                    filteredPreview.map(product => (
                      <button
                        key={product.id}
                        onClick={() => {
                          onViewProduct(product);
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-gray-50 transition text-left"
                      >
                        <img src={product.image} alt={product.name} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl object-cover shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] md:text-xs font-bold text-navy truncate">{product.name}</p>
                          <p className="text-[8px] md:text-[10px] font-bold text-gold">৳{product.price.toLocaleString()}</p>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[8px] text-gray-300"></i>
                      </button>
                    ))
                  ) : (
                    <div className="p-6 md:p-8 text-center">
                      <p className="text-[10px] md:text-xs text-gray-400 italic">No matches found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. Functional Icons (Right of Search) */}
          <div className="flex items-center space-x-1.5 md:space-x-3">
            {/* Advisor (Desktop only) */}
            <button 
              onClick={onConsultantClick}
              className="hidden md:flex relative items-center space-x-2 px-4 py-2 bg-navy text-white rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 group overflow-hidden"
            >
               <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0"></div>
              <i className="fa-solid fa-wand-magic-sparkles text-[10px] relative z-10 group-hover:text-navy transition-colors"></i>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] relative z-10 group-hover:text-navy transition-colors">Advisor</span>
            </button>

            {/* User Icon */}
            <button 
              onClick={onUserClick}
              className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-all active:scale-90 border border-gray-100 hover:border-gold hover:shadow-md ${
                currentUser ? 'bg-navy text-gold shadow-lg' : 'bg-white text-navy'
              }`}
            >
              {currentUser ? (
                <span className="text-[10px] md:text-xs font-black uppercase">{currentUser.name.charAt(0)}</span>
              ) : (
                <i className="fa-solid fa-user text-xs md:text-sm"></i>
              )}
            </button>

            {/* Cart Icon */}
            <button 
              onClick={onCartClick}
              className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-navy bg-white border border-gray-100 rounded-full hover:border-gold hover:shadow-lg transition-all active:scale-90"
              aria-label="Open Cart"
            >
              <i className="fa-solid fa-shopping-bag text-xs md:text-sm"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[7px] md:text-[9px] font-black text-white bg-gold rounded-full border-2 border-white shadow-md animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;