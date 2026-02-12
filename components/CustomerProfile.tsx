
import React, { useState } from 'react';
import { User, Order, Product, Address, SkinProfile, SavedPaymentMethod } from '../types';

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

type ProfileTab = 'dashboard' | 'personal' | 'addresses' | 'orders' | 'wishlist' | 'skin' | 'loyalty';

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
  const [activeTab, setActiveTab] = useState<ProfileTab>('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Mocked coupons for demonstration
  const coupons = [
    { code: 'REYAHL10', discount: 10, description: '10% off on your next purchase', expiry: '2024-12-31' },
    { code: 'GLOW500', discount: 500, description: '৳500 flat discount for Gold members', expiry: '2024-06-15' },
  ];

  if (!user) return null;

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated: User = {
      ...user,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      gender: formData.get('gender') as any,
      dob: formData.get('dob') as string,
    };
    onUpdateProfile(updated);
    setIsEditingProfile(false);
  };

  const handleAddAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAddr: Address = {
      id: Math.random().toString(36).substr(2, 9),
      label: formData.get('label') as string,
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      district: formData.get('district') as string,
      details: formData.get('details') as string,
      isDefault: user.addresses.length === 0,
    };
    onUpdateProfile({ ...user, addresses: [...user.addresses, newAddr] });
    setIsAddingAddress(false);
  };

  const setAddressDefault = (id: string) => {
    const updated = user.addresses.map(a => ({ ...a, isDefault: a.id === id }));
    onUpdateProfile({ ...user, addresses: updated });
  };

  const removeAddress = (id: string) => {
    onUpdateProfile({ ...user, addresses: user.addresses.filter(a => a.id !== id) });
  };

  const updateSkinProfile = (type: SkinProfile['type']) => {
    onUpdateProfile({ ...user, skinProfile: { ...user.skinProfile, type } });
  };

  const toggleSkinConcern = (concern: string) => {
    const concerns = user.skinProfile.concerns.includes(concern)
      ? user.skinProfile.concerns.filter(c => c !== concern)
      : [...user.skinProfile.concerns, concern];
    onUpdateProfile({ ...user, skinProfile: { ...user.skinProfile, concerns } });
  };

  const removePaymentMethod = (id: string) => {
    const updated = user.savedPayments?.filter(p => p.id !== id) || [];
    onUpdateProfile({ ...user, savedPayments: updated });
  };

  const wishlistProducts = allProducts.filter(p => user.wishlist.includes(p.id));

  const navItems: { id: ProfileTab; icon: string; label: string }[] = [
    { id: 'dashboard', icon: 'fa-house-user', label: 'Dashboard' },
    { id: 'personal', icon: 'fa-id-card', label: 'Personal Information' },
    { id: 'addresses', icon: 'fa-location-dot', label: 'Address Book' },
    { id: 'orders', icon: 'fa-box-open', label: 'Order History' },
    { id: 'wishlist', icon: 'fa-heart', label: 'Wishlist' },
    { id: 'skin', icon: 'fa-sparkles', label: 'Skin Profile' },
    { id: 'loyalty', icon: 'fa-award', label: 'Loyalty & Rewards' },
  ];

  return (
    <div className={`fixed inset-0 z-[200] transition-all duration-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-4xl ml-auto bg-[#fafbfc] shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-in slide-in-from-right duration-500">
        
        {/* Profile Sidebar Nav */}
        <aside className="lg:w-72 bg-navy text-white flex flex-col shrink-0">
          <div className="p-8 border-b border-white/5 text-center">
            <div className="w-20 h-20 bg-gold text-navy rounded-3xl flex items-center justify-center font-serif text-3xl font-bold mx-auto mb-4 shadow-xl border-4 border-navy">
              {user.name.charAt(0)}
            </div>
            <h2 className="font-bold text-lg truncate">{user.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
               <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
               <p className="text-[10px] font-black uppercase tracking-widest text-gold opacity-80">Premium Member</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 text-sm font-bold tracking-wide ${activeTab === item.id ? 'bg-gold text-navy shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <i className={`fa-solid ${item.icon} w-5`}></i>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-8 border-t border-white/5">
            <button onClick={onLogout} className="w-full py-4 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/40 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-sm">
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout Account
            </button>
          </div>
        </aside>

        {/* Main Profile Area */}
        <main className="flex-1 flex flex-col min-h-0 bg-white">
          <header className="p-6 md:p-8 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
            <div>
              <h3 className="text-2xl font-black text-navy tracking-tight">{navItems.find(n => n.id === activeTab)?.label}</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Personalized Hub • Reyah Corner</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-navy hover:bg-red-500 hover:text-white transition-all shadow-sm">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
            
            {/* Dashboard Section */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-navy p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Loyalty Points</p>
                    <h4 className="text-4xl font-black text-gold">{user.rewardPoints}</h4>
                    <p className="text-[10px] text-white/40 mt-4 font-bold">৳100 Spent = 1 Point</p>
                  </div>
                  <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Total Orders</p>
                    <h4 className="text-4xl font-black text-navy">{orders.length}</h4>
                    <button onClick={() => setActiveTab('orders')} className="text-[10px] font-bold text-gold uppercase mt-4 hover:tracking-widest transition-all">View History <i className="fa-solid fa-arrow-right ml-1"></i></button>
                  </div>
                  <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Skin Type</p>
                    <h4 className="text-xl font-black text-navy truncate">{user.skinProfile.type || 'Not Analyzed'}</h4>
                    <button onClick={() => setActiveTab('skin')} className="text-[10px] font-bold text-gold uppercase mt-4 hover:tracking-widest transition-all">Update Profile <i className="fa-solid fa-wand-sparkles ml-1"></i></button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Most Recent Order</h5>
                  {orders.length > 0 ? (
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-sage rounded-2xl flex items-center justify-center text-navy font-black shadow-inner border border-gray-50">
                            #{orders[0].id.slice(-4)}
                          </div>
                          <div>
                            <p className="font-bold text-navy">Placed On: {new Date(orders[0].date).toLocaleDateString()}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="w-2 h-2 bg-gold rounded-full"></span>
                               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{orders[0].status}</p>
                            </div>
                          </div>
                       </div>
                       <p className="text-2xl font-black text-navy">৳{orders[0].total.toLocaleString()}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50/50 p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center">
                       <p className="text-gray-400 italic">Your order history is currently empty.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Personal Information Section */}
            {activeTab === 'personal' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-navy">Profile Details</h4>
                      <p className="text-xs text-gray-400">Information used for shipping and offers</p>
                    </div>
                    <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="px-6 py-2 bg-navy text-gold rounded-full text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition">
                      {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                      <input name="name" disabled={!isEditingProfile} defaultValue={user.name} required className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-gold transition disabled:opacity-50 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email (Primary)</label>
                      <input disabled defaultValue={user.email} className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm outline-none opacity-50 cursor-not-allowed font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Number</label>
                      <input name="phone" disabled={!isEditingProfile} defaultValue={user.phone} placeholder="01XXX-XXXXXX" className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-gold transition disabled:opacity-50 font-medium" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Gender</label>
                        <select name="gender" disabled={!isEditingProfile} defaultValue={user.gender} className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-gold transition disabled:opacity-50 font-medium">
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Date of Birth</label>
                        <input name="dob" type="date" disabled={!isEditingProfile} defaultValue={user.dob} className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-gold transition disabled:opacity-50 font-medium" />
                      </div>
                    </div>
                    {isEditingProfile && (
                      <div className="md:col-span-2 pt-4">
                        <button type="submit" className="w-full py-5 bg-navy text-white font-black rounded-2xl shadow-xl hover:bg-gold hover:text-navy transition uppercase tracking-[0.2em] text-xs">Update Profile Information</button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* Address Book Section */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-navy">Delivery Addresses</h4>
                    <p className="text-xs text-gray-400">Saved locations for faster checkout</p>
                  </div>
                  <button onClick={() => setIsAddingAddress(!isAddingAddress)} className="px-6 py-3 bg-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-gold transition">
                    {isAddingAddress ? 'Cancel' : 'Add New Address'}
                  </button>
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleAddAddress} className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-gold/30 shadow-xl space-y-6 animate-in zoom-in-95">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Label (e.g., Home, Work)</label>
                        <input name="label" required placeholder="Address Label" className="w-full bg-gray-50 p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Receiver Name</label>
                        <input name="fullName" required placeholder="Full Name" className="w-full bg-gray-50 p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Contact Number</label>
                        <input name="phone" required placeholder="01XXX-XXXXXX" className="w-full bg-gray-50 p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">District / Area</label>
                        <input name="district" required placeholder="Dhaka, Chittagong, etc." className="w-full bg-gray-50 p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Detailed Address</label>
                      <textarea name="details" required rows={2} placeholder="House no, Road no, Apartment name..." className="w-full bg-gray-50 p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gold resize-none" />
                    </div>
                    <button type="submit" className="w-full py-4 bg-navy text-white font-bold rounded-xl shadow-lg uppercase tracking-widest text-xs">Save Address Entry</button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.addresses.map(addr => (
                    <div key={addr.id} className={`p-8 rounded-[2.5rem] border-2 transition-all relative ${addr.isDefault ? 'border-gold bg-gold/5 shadow-inner' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                      {addr.isDefault && <span className="absolute top-6 right-6 px-3 py-1 bg-gold text-navy text-[8px] font-black uppercase rounded-full shadow-sm tracking-widest">Default</span>}
                      <h5 className="font-black text-navy uppercase text-[10px] tracking-widest mb-4">{addr.label}</h5>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-navy">{addr.fullName}</p>
                        <p className="text-xs text-gray-500">{addr.phone}</p>
                        <p className="text-xs text-gray-400 mt-2 italic leading-relaxed">{addr.district}, {addr.details}</p>
                      </div>
                      <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
                        {!addr.isDefault && <button onClick={() => setAddressDefault(addr.id)} className="text-[10px] font-bold text-navy hover:text-gold uppercase tracking-tighter transition">Set as Default</button>}
                        <button onClick={() => removeAddress(addr.id)} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-tighter transition ml-auto">Delete</button>
                      </div>
                    </div>
                  ))}
                  {user.addresses.length === 0 && !isAddingAddress && (
                    <div className="md:col-span-2 text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-medium">No saved addresses found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order History Section */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                {orders.length === 0 ? (
                  <div className="text-center py-20">
                     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <i className="fa-solid fa-box-open text-4xl"></i>
                     </div>
                     <p className="text-gray-400 italic">No previous orders recorded.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm group hover:border-gold/30 transition-all duration-500">
                        <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                           <div className="flex items-center gap-4">
                              <p className="text-[10px] font-black uppercase text-gold tracking-widest">ORDER #{order.id.slice(-6)}</p>
                              <span className="text-[10px] font-bold text-gray-400">•</span>
                              <p className="text-xs text-gray-500 font-medium">{new Date(order.date).toLocaleDateString()}</p>
                           </div>
                           <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                             order.status === 'Delivered' ? 'bg-green-500 text-white' : 
                             order.status === 'Cancelled' ? 'bg-red-500 text-white' : 
                             'bg-navy text-white'
                           }`}>
                             {order.status}
                           </div>
                        </div>
                        <div className="p-8 space-y-6">
                           <div className="space-y-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                   <img src={item.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt={item.name} />
                                   <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-navy truncate">{item.name}</p>
                                      <p className="text-[10px] text-gray-400 uppercase font-black">{item.quantity} x ৳{item.price}</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                           <div className="pt-6 border-t border-gray-100 flex justify-between items-center gap-4 flex-wrap">
                              <div>
                                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Payment</p>
                                 <p className="text-xl font-black text-navy">৳{order.total.toLocaleString()}</p>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => window.alert(`Exporting Invoice for order #${order.id.slice(-6)}...`)}
                                  className="px-6 py-3 bg-white text-navy text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition shadow-sm border border-gray-100 flex items-center gap-2"
                                >
                                  <i className="fa-solid fa-file-invoice"></i>
                                  Invoice
                                </button>
                                <button 
                                  onClick={() => order.items.forEach(it => onAddToCart(it))}
                                  className="px-6 py-3 bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold hover:text-navy transition shadow-sm border border-navy"
                                >
                                  Re-order
                                </button>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Section */}
            {activeTab === 'wishlist' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-red-100">
                      <i className="fa-solid fa-heart text-4xl"></i>
                    </div>
                    <p className="text-gray-400 font-medium">Your wishlist is currently empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistProducts.map(p => (
                      <div key={p.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm flex flex-col items-center text-center group">
                        <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-6 bg-gray-50 shadow-inner">
                          <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={p.name} />
                          <button onClick={() => onAddToWishlist(p.id)} className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition active:scale-90">
                             <i className="fa-solid fa-heart"></i>
                          </button>
                        </div>
                        <h5 className="font-bold text-navy mb-2">{p.name}</h5>
                        <p className="text-gold font-black mb-6">৳{p.price.toLocaleString()}</p>
                        <button onClick={() => onAddToCart(p)} className="w-full py-4 bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gold transition shadow-xl active:scale-95">Add to Bag</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Skin Profile Section */}
            {activeTab === 'skin' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                <section className="space-y-6">
                  <div className="text-center space-y-2">
                    <h4 className="text-lg font-bold text-navy">Analyze Skin Type</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">Select your primary skin category for expert recommendations.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {(['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'] as const).map(type => (
                      <button 
                        key={type}
                        onClick={() => updateSkinProfile(type)}
                        className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all duration-300 ${user.skinProfile.type === type ? 'border-gold bg-gold/5 shadow-inner' : 'border-gray-50 bg-white hover:border-gold/30 hover:shadow-md'}`}
                      >
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-lg ${user.skinProfile.type === type ? 'bg-gold text-navy shadow-lg' : 'bg-gray-50 text-gray-400'}`}>
                            <i className={`fa-solid ${type === 'Oily' ? 'fa-droplet' : type === 'Dry' ? 'fa-sun' : type === 'Sensitive' ? 'fa-hand-holding-heart' : 'fa-check'}`}></i>
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-tighter text-navy">{type}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="text-center space-y-2">
                    <h4 className="text-lg font-bold text-navy">Primary Concerns</h4>
                    <p className="text-xs text-gray-400">Mark areas you wish to target.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['Acne', 'Dark Spots', 'Aging', 'Redness', 'Dullness', 'Pores', 'Hydration'].map(concern => (
                      <button 
                        key={concern}
                        onClick={() => toggleSkinConcern(concern)}
                        className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${user.skinProfile.concerns.includes(concern) ? 'bg-navy text-gold shadow-xl scale-105' : 'bg-gray-100 text-navy/40 hover:bg-navy/5 hover:text-navy'}`}
                      >
                         {concern}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="bg-navy p-10 rounded-[3rem] text-center space-y-4 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-[2000ms]"></div>
                   <i className="fa-solid fa-wand-magic-sparkles text-gold text-3xl mb-2 animate-pulse"></i>
                   <h5 className="text-white font-serif text-xl italic">"Personalized Care Awaits"</h5>
                   <p className="text-white/40 text-xs leading-relaxed max-w-sm mx-auto">Your profile helps our AI Consultant deliver precise, tailored skincare solutions.</p>
                </div>
              </div>
            )}

            {/* Loyalty & Payment Section */}
            {activeTab === 'loyalty' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                {/* Reward Points Detailed */}
                <section className="bg-navy p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                   <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="text-center md:text-left">
                         <h4 className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-2">Available Loyalty Balance</h4>
                         <p className="text-6xl font-black">{user.rewardPoints} Pts</p>
                         <p className="text-white/40 text-xs mt-4">Redeem points for store credit and exclusive perks.</p>
                      </div>
                      <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button className="px-8 py-4 bg-gold text-navy font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Convert to Voucher</button>
                        <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Balance History</button>
                      </div>
                   </div>
                </section>

                {/* Coupons & Vouchers */}
                <section className="space-y-6">
                   <h4 className="text-lg font-bold text-navy">Exclusive Vouchers</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {coupons.map((coupon, i) => (
                        <div key={i} className="bg-white border-2 border-dashed border-gold/40 p-6 rounded-[2.5rem] flex items-center justify-between group hover:bg-gold/5 transition-all">
                           <div>
                              <p className="text-gold font-black text-xl mb-1">{coupon.code}</p>
                              <p className="text-navy font-bold text-xs">{coupon.description}</p>
                              <p className="text-[10px] text-gray-400 mt-2">Valid Until: {coupon.expiry}</p>
                           </div>
                           <button onClick={() => {
                             navigator.clipboard.writeText(coupon.code);
                             alert(`Copied: ${coupon.code}`);
                           }} className="w-12 h-12 rounded-2xl bg-gray-50 text-navy flex items-center justify-center hover:bg-gold hover:text-white transition-all shadow-sm">
                              <i className="fa-solid fa-copy"></i>
                           </button>
                        </div>
                      ))}
                   </div>
                </section>

                {/* Saved Payment Methods */}
                <section className="space-y-6">
                   <div className="flex justify-between items-center">
                     <h4 className="text-lg font-bold text-navy">Saved Payments</h4>
                     <button className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-navy transition">+ Add New Method</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.savedPayments && user.savedPayments.length > 0 ? (
                        user.savedPayments.map(pay => (
                          <div key={pay.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-navy shadow-sm">
                                   <i className={`fa-solid ${pay.type === 'Card' ? 'fa-credit-card' : 'fa-wallet'}`}></i>
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-navy">{pay.provider}</p>
                                   <p className="text-xs text-gray-400">{pay.lastFour ? `Ends with **** ${pay.lastFour}` : pay.accountNumber}</p>
                                </div>
                             </div>
                             <button onClick={() => removePaymentMethod(pay.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                <i className="fa-solid fa-trash-can"></i>
                             </button>
                          </div>
                        ))
                      ) : (
                        <div className="md:col-span-2 py-12 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center">
                           <p className="text-gray-400 text-sm">No payment methods linked to this account.</p>
                        </div>
                      )}
                   </div>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c5a05933;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c5a059;
        }
      `}</style>
    </div>
  );
};

export default CustomerProfile;
