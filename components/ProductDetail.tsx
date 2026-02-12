
import React from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart, onBuyNow }) => {
  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
      {/* Background Overlay click handler */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative min-h-screen bg-white/95 backdrop-blur-2xl flex flex-col shadow-2xl">
        {/* Header/Close Button */}
        <div className="sticky top-0 z-20 p-4 md:p-6 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center max-w-7xl mx-auto w-full shadow-sm">
          <button 
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all active:scale-90 shadow-sm"
            title="Go Back"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          
          <div className="flex flex-col items-center">
            <span className="font-black text-navy tracking-[0.2em] uppercase text-[10px] md:text-xs">Product Showcase</span>
          </div>
          
          <button 
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-full flex items-center justify-center text-navy hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm"
            title="Close"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 flex-1 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-start">
            {/* Image Section */}
            <div className="lg:w-1/2 w-full">
              <div className="relative group rounded-[3rem] overflow-hidden bg-white shadow-2xl border-[10px] border-white">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-6 left-6">
                   <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-navy shadow-lg border border-white">
                      {product.category}
                   </span>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="lg:w-1/2 space-y-10 py-4">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-navy leading-[1.1] tracking-tight">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <p className="text-4xl font-black text-gold">৳{product.price.toLocaleString()}</p>
                  <div className="h-8 w-px bg-gray-200"></div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                   <div className="h-px flex-1 bg-gray-100"></div>
                   <h3 className="font-black text-gray-400 uppercase tracking-[0.3em] text-[10px]">Description</h3>
                   <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed font-light italic">
                  "{product.description}"
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Our {product.name} is specially formulated to deeply nourish your skin and restore its natural radiance. It contains no harmful chemicals and is made with 100% organic elements.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                <button 
                  onClick={() => onAddToCart(product)}
                  className="group relative py-5 px-8 bg-navy text-white font-black rounded-3xl shadow-2xl overflow-hidden transition-all active:scale-95 flex items-center justify-center space-x-4 border border-navy"
                >
                  <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <i className="fa-solid fa-bag-shopping text-xl relative z-10 group-hover:text-navy transition-colors"></i>
                  <span className="relative z-10 group-hover:text-navy transition-colors uppercase tracking-widest text-xs">Add to Bag</span>
                </button>
                <button 
                   onClick={() => onBuyNow?.(product)}
                  className="py-5 px-8 bg-white border-2 border-navy text-navy font-black rounded-3xl shadow-lg hover:bg-navy hover:text-white transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-10 border-t border-gray-100 grid grid-cols-3 gap-6">
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 bg-sage rounded-2xl flex items-center justify-center mb-3 text-navy group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
                    <i className="fa-solid fa-leaf text-xl"></i>
                  </div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Organic</p>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 bg-sage rounded-2xl flex items-center justify-center mb-3 text-navy group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
                    <i className="fa-solid fa-droplet text-xl"></i>
                  </div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Hydrating</p>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 bg-sage rounded-2xl flex items-center justify-center mb-3 text-navy group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
                    <i className="fa-solid fa-shield-heart text-xl"></i>
                  </div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Dermatology Safe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative footer inside drawer */}
        <div className="p-10 text-center bg-gray-50 mt-auto border-t border-gray-100">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Reyah Corner • Sanctuary of Purity</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
