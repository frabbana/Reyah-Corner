
import React, { useState } from 'react';
import { CartItem, User, Address, PaymentMethod } from '../types';

interface CheckoutReviewProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: User;
  onConfirm: (address: Address, paymentMethod: PaymentMethod, transactionId?: string) => void;
  onUpdateUser: (updatedUser: User) => void;
}

const CheckoutReview: React.FC<CheckoutReviewProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  user, 
  onConfirm,
  onUpdateUser
}) => {
  const [step, setStep] = useState<'review' | 'payment'>('review');
  const [isAddingAddress, setIsAddingAddress] = useState(user.addresses.length === 0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    user.addresses.find(a => a.isDefault)?.id || user.addresses[0]?.id || null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [transactionId, setTransactionId] = useState('');
  const [validationError, setValidationError] = useState('');

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedAddress = user.addresses.find(a => a.id === selectedAddressId);

  const handleAddAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAddress: Address = {
      id: Math.random().toString(36).substr(2, 9),
      label: formData.get('label') as string,
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      district: formData.get('district') as string,
      details: formData.get('details') as string,
      isDefault: user.addresses.length === 0
    };

    const updatedUser = {
      ...user,
      addresses: [...user.addresses, newAddress],
      phone: user.phone || newAddress.phone
    };
    
    onUpdateUser(updatedUser);
    setSelectedAddressId(newAddress.id);
    setIsAddingAddress(false);
  };

  const handleConfirm = () => {
    if (paymentMethod !== 'COD' && transactionId.trim().length < 8) {
      setValidationError('Please enter a valid Transaction ID.');
      return;
    }
    if (selectedAddress) {
      onConfirm(selectedAddress, paymentMethod, transactionId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-300 border border-white/20">
        <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-navy text-gold rounded-xl flex items-center justify-center">
                <i className={`fa-solid ${step === 'review' ? 'fa-cart-shopping' : 'fa-shield-check'}`}></i>
             </div>
             <div>
                <h2 className="text-xl font-bold text-navy">
                  {step === 'review' ? 'Review Order' : 'Payment Verification'}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mt-1">
                  Secure Checkout
                </p>
             </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full hover:bg-gray-100 flex items-center justify-center text-navy transition">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {step === 'review' ? (
            <>
              {/* Shipping Address */}
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Delivery Address</h3>
                  {!isAddingAddress && user.addresses.length > 0 && (
                    <button onClick={() => setIsAddingAddress(true)} className="text-[10px] font-bold text-gold hover:text-navy transition border-b border-gold/30">+ New Address</button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input name="fullName" required defaultValue={user.name} placeholder="Full Name" className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-gray-100 outline-none text-sm" />
                      <input name="phone" required defaultValue={user.phone} placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-gray-100 outline-none text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input name="district" required placeholder="District" className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-gray-100 outline-none text-sm" />
                      <input name="label" defaultValue="Home" className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-gray-100 outline-none text-sm" />
                    </div>
                    <textarea name="details" required rows={2} className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-gray-100 outline-none text-sm resize-none" placeholder="Detailed Address (House/Road/Area)"></textarea>
                    <button type="submit" className="w-full py-3 bg-navy text-white font-bold rounded-xl text-xs uppercase tracking-widest">Save Address</button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {user.addresses.map(addr => (
                      <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)} className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-gold bg-gold/5 shadow-inner' : 'border-gray-50 bg-white hover:border-gray-200'}`}>
                        <div className="flex justify-between mb-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-navy">{addr.label}</span>
                           {selectedAddressId === addr.id && <i className="fa-solid fa-circle-check text-gold"></i>}
                        </div>
                        <p className="text-sm font-bold text-navy">{addr.fullName} • {addr.phone}</p>
                        <p className="text-xs text-gray-500 mt-1">{addr.district}, {addr.details}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Payment Method */}
              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'COD', label: 'Cash On Delivery', icon: 'fa-truck-fast', color: 'text-navy', bg: 'bg-gray-100' },
                    { id: 'bKash', label: 'bKash (Send Money)', icon: 'fa-wallet', color: 'text-[#D82A77]', bg: 'bg-[#D82A77]/10' },
                    { id: 'Nagad', label: 'Nagad', icon: 'fa-building-columns', color: 'text-[#f7941d]', bg: 'bg-[#f7941d]/10' },
                    { id: 'Rocket', label: 'Rocket', icon: 'fa-mobile-screen', color: 'text-[#8c3494]', bg: 'bg-[#8c3494]/10' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all ${
                        paymentMethod === method.id 
                        ? 'border-gold bg-gold/5 shadow-inner' 
                        : 'border-gray-50 bg-white hover:border-gray-100'
                      }`}
                    >
                       <div className={`w-12 h-12 ${method.bg} ${method.color} rounded-2xl flex items-center justify-center mb-3 shadow-sm`}>
                          <i className={`fa-solid ${method.icon} text-xl`}></i>
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-navy">{method.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Order Summary */}
              <section className="bg-navy text-white p-8 rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="flex justify-between items-center text-sm opacity-60">
                    <span>Products Total</span>
                    <span>৳{total.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm opacity-60">
                    <span>Delivery Fee</span>
                    <span className="text-gold">FREE</span>
                 </div>
                 <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm font-black uppercase tracking-widest">Total Payable</span>
                    <span className="text-3xl font-black text-gold">৳{total.toLocaleString()}</span>
                 </div>
              </section>
            </>
          ) : (
            <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4">
               <div className="text-center space-y-4">
                  <div className={`w-20 h-20 mx-auto rounded-[2.5rem] flex items-center justify-center text-3xl shadow-2xl ${
                    paymentMethod === 'bKash' ? 'bg-[#D82A77] text-white' : 
                    paymentMethod === 'Nagad' ? 'bg-[#f7941d] text-white' : 
                    'bg-[#8c3494] text-white'
                  }`}>
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy">Confirm Payment</h3>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Verified Payment Gateway</p>
                  </div>
               </div>

               <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-[2.5rem] text-center space-y-4">
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.3em]">Personal Number</p>
                  <p className="text-3xl font-black text-navy tracking-tight select-all cursor-pointer hover:text-gold transition-colors">01301501827</p>
                  <div className="h-px bg-gray-200 w-16 mx-auto"></div>
                  <p className="text-sm text-navy leading-relaxed">
                     Please <span className="font-black bg-navy text-white px-2 py-0.5 rounded">Send Money</span> of <span className="font-black text-gold">৳{total.toLocaleString()}</span> from your {paymentMethod} account to the number above and enter your Transaction ID below.
                  </p>
               </div>

               <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 ml-2">Transaction ID</label>
                     <input 
                        type="text"
                        value={transactionId}
                        onChange={(e) => {
                          setTransactionId(e.target.value.toUpperCase());
                          setValidationError('');
                        }}
                        placeholder="Ex: 9A2B3C4D5E"
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-2 ring-gray-100 focus:ring-navy outline-none transition text-navy font-bold tracking-widest"
                     />
                     {validationError && <p className="text-[10px] text-red-600 font-bold ml-2 animate-pulse">{validationError}</p>}
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-white border-t flex flex-col gap-4">
          {step === 'review' ? (
            <button 
              disabled={!selectedAddress || isAddingAddress}
              onClick={() => {
                if (paymentMethod === 'COD') handleConfirm();
                else setStep('payment');
              }}
              className="w-full py-6 bg-navy text-white font-black rounded-3xl shadow-2xl hover:bg-gold hover:text-navy transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center space-x-4 uppercase tracking-[0.2em] text-xs"
            >
               <span>{paymentMethod === 'COD' ? 'Confirm Order' : 'Proceed to Payment'}</span>
               <i className="fa-solid fa-chevron-right"></i>
            </button>
          ) : (
            <div className="flex flex-col gap-3">
               <button 
                 disabled={!transactionId.trim()}
                 onClick={handleConfirm}
                 className="w-full py-6 bg-navy text-white font-black rounded-3xl shadow-2xl hover:bg-green-600 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs disabled:opacity-30"
               >
                  Submit Order
               </button>
               <button 
                 onClick={() => setStep('review')}
                 className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-navy transition py-2"
               >
                  Go Back
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutReview;
