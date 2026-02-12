
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="bg-white rounded-[2.5rem] overflow-hidden group border border-gray-100 hover:shadow-[0_40px_80px_-20px_rgba(0,18,46,0.15)] transition-all duration-700 flex flex-col h-full cursor-pointer relative"
    >
      <div className="relative aspect-square overflow-hidden m-5 rounded-[2rem] bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-navy/5 group-hover:bg-transparent transition-colors duration-700"></div>
        <div className="absolute top-4 left-4">
          <span className="bg-white shadow-sm border border-gray-100 px-4 py-2 text-[9px] font-black uppercase tracking-[0.3em] rounded-full text-navy">
            {product.category}
          </span>
        </div>
        
        {/* Quick Add Button Overlay */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-10 py-4 bg-navy text-white font-bold rounded-2xl opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-2xl hover:bg-gold hover:text-navy z-10"
        >
          <span className="text-xs uppercase tracking-widest">Add to Bag</span>
        </button>
      </div>

      <div className="px-10 pb-10 pt-2 flex flex-col flex-1">
        <h3 className="text-2xl font-bold mb-2 text-navy group-hover:text-gold transition-colors">{product.name}</h3>
        <p className="text-sm text-gray-400 font-medium mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Premium Price</span>
            <span className="text-2xl font-black text-navy">৳{product.price.toLocaleString()}</span>
          </div>
          <div className="w-12 h-12 bg-navy/5 text-navy group-hover:bg-navy group-hover:text-white rounded-full flex items-center justify-center transition-all duration-500 shadow-inner">
            <i className="fa-solid fa-arrow-right-long"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
