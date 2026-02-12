
import React, { useState, useEffect } from 'react';
import { User, Order, Product, Address } from '../types';

interface CustomerProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  orders: Order[];
  allProducts: Product[];
  onLogout: () => void;
  onUpdateProfile: (updatedUser: User) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (productId: string) => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  orders, 
  allProducts,
  onLogout, 
  onUpdateProfile,
  onAddToCart,
  onAddToWishlist
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'rewards'>('overview');

  if (!user) return null;

  return (
    <div className={`fixed inset-0 z-[200] transition-all duration-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-2xl ml-auto bg-white shadow-2xl flex flex-col">
        
        {/* Header with Close Button */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold text-navy rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-navy">{user.name}</h2>
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Premium Member</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-navy hover:bg-red-500 hover:text-white transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="flex gap-4 border-b pb-4">
            <button onClick={() => setActiveTab('overview')} className={`text-xs font-bold uppercase tracking-widest ${activeTab === 'overview' ? 'text-gold border-b-2 border-gold pb-2' : 'text-gray-400'}`}>Overview</button>
            <button onClick={() => setActiveTab('orders')} className={`text-xs font-bold uppercase tracking-widest ${activeTab === 'orders' ? 'text-gold border-b-2 border-gold pb-2' : 'text-gray-400'}`}>Orders</button>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Orders</p>
                <p className="text-2xl font-black text-navy">{orders.length}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Points</p>
                <p className="text-2xl font-black text-navy">{user.rewardPoints}</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-center text-gray-400 py-10 italic">No orders found.</p>
              ) : (
                orders.map(o => (
                  <div key={o.id} className="p-5 border border-gray-100 rounded-3xl bg-gray-50/50">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-xs font-bold text-navy">#{o.id.slice(-6)}</p>
                      <span className="text-[10px] font-black uppercase text-gold">{o.status}</span>
                    </div>
                    <div className="flex -space-x-2">
                      {o.items.map((it, idx) => (
                        <img key={idx} src={it.image} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                      ))}
                    </div>
                    <p className="text-right font-black text-navy mt-2">৳{o.total}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-8 border-t bg-gray-50">
          <button onClick={onLogout} className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
