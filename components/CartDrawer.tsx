
import React from 'react';
import { CartItem, User } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
  currentUser: User | null;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQuantity, 
  onCheckout,
  currentUser 
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[120] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-navy tracking-tight">Your Bag</h2>
            <p className="text-xs text-gray-400 font-medium">{items.length} items</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center text-navy transition">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <i className="fa-solid fa-bag-shopping text-4xl"></i>
              </div>
              <p className="text-gray-400 font-medium italic">Your bag is empty!</p>
              <button onClick={onClose} className="text-navy font-bold border-b-2 border-gold pb-1">Start Shopping</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex space-x-4 group">
                <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-navy group-hover:text-gold transition">{item.name}</h4>
                      <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition">
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center border rounded-xl px-2 py-1 space-x-3 border-gray-100 bg-gray-50/50">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} disabled={item.quantity <= 1} className="text-navy disabled:opacity-20">
                        <i className="fa-solid fa-minus text-[10px]"></i>
                      </button>
                      <span className="text-xs font-black w-4 text-center text-navy">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-navy">
                        <i className="fa-solid fa-plus text-[10px]"></i>
                      </button>
                    </div>
                    <span className="font-bold text-navy">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t bg-gray-50/50 space-y-5">
            <div className="flex justify-between items-center text-xl font-bold text-navy">
              <span>Total Bill</span>
              <span className="text-gold">৳{total.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={onCheckout}
              className="w-full py-5 bg-navy text-white font-bold rounded-2xl shadow-xl hover:bg-gold hover:text-navy transition active:scale-[0.98] flex items-center justify-center space-x-3"
            >
              <i className="fa-solid fa-lock text-sm"></i>
              <span>{currentUser ? 'Complete Purchase' : 'Login to Checkout'}</span>
            </button>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Secure Delivery Across Bangladesh
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
