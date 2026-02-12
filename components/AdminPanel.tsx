
import React, { useState, useMemo } from 'react';
import { Product, Order, User } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  users: User[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrder: (id: string, status: Order['status'], tracking?: string) => void;
  onUpdateStock: (id: string, quantity: number) => void;
  onUpdateProduct: (product: Product) => void;
  onExit: () => void;
  onLogout: () => void;
}

type AdminTab = 'dashboard' | 'inventory' | 'orders';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, 
  orders, 
  onAddProduct, 
  onDeleteProduct,
  onUpdateOrder,
  onUpdateStock,
  onUpdateProduct,
  onExit,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const totalRevenue = useMemo(() => orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0), [orders]);
  const activeOrdersCount = useMemo(() => orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length, [orders]);

  const copyOrderDetails = (order: Order) => {
    const items = order.items.map(it => `- ${it.name} (x${it.quantity})`).join('\n');
    const text = `
🛒 **ORDER #${order.id.slice(-6)}**
👤 Name: ${order.userName}
📞 Phone: ${order.shippingAddress?.phone || 'N/A'}
📍 Address: ${order.shippingAddress?.district}, ${order.shippingAddress?.details}
🛍️ Items:
${items}
💰 Total: ৳${order.total.toLocaleString()}
💳 Method: ${order.paymentMethod}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(order.id);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  const openModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setImagePreview(product?.image || null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Product = {
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      minStockAlert: 5,
      description: formData.get('desc') as string,
      image: imagePreview || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400',
    };
    if (editingProduct) onUpdateProduct(productData);
    else onAddProduct(productData);
    setIsModalOpen(false);
  };

  const navItems = [
    { id: 'dashboard', icon: 'fa-chart-line', label: 'Overview' },
    { id: 'inventory', icon: 'fa-boxes-stacked', label: 'Products' },
    { id: 'orders', icon: 'fa-truck-fast', label: 'Orders' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-24 pb-32 md:pb-20 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-[2rem] sticky top-32 shadow-2xl">
            <h2 className="text-gold font-black uppercase tracking-widest text-[10px] mb-8 text-center opacity-60">Admin Command</h2>
            <nav className="space-y-2">
              {navItems.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as AdminTab)} 
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTab === tab.id ? 'bg-gold text-navy font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <i className={`fa-solid ${tab.icon}`}></i>
                  <span className="text-sm font-bold">{tab.label}</span>
                </button>
              ))}
              <div className="pt-8 mt-8 border-t border-white/5 space-y-2">
                <button onClick={onExit} className="w-full flex items-center gap-4 p-4 rounded-xl text-slate-300 hover:bg-white/5 transition-all">
                  <i className="fa-solid fa-house"></i>
                  <span className="text-sm font-bold">Return to Shop</span>
                </button>
                <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span className="text-sm font-bold">Log Out</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Mobile Fixed Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[150] bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-4 py-4 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          {navItems.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as AdminTab)} 
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === tab.id ? 'text-gold' : 'text-slate-500'}`}
            >
              <i className={`fa-solid ${tab.icon} text-lg`}></i>
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
          <button onClick={onExit} className="flex flex-col items-center gap-1.5 text-slate-400">
            <i className="fa-solid fa-house text-lg"></i>
            <span className="text-[9px] font-black uppercase tracking-widest">Shop</span>
          </button>
          <button onClick={onLogout} className="flex flex-col items-center gap-1.5 text-red-400">
            <i className="fa-solid fa-power-off text-lg"></i>
            <span className="text-[9px] font-black uppercase tracking-widest">Logout</span>
          </button>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 md:space-y-8">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-xl group hover:border-gold/30 transition-all">
                  <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase mb-2 tracking-widest">Total Revenue</p>
                  <h3 className="text-2xl md:text-4xl font-black text-white">৳{totalRevenue.toLocaleString()}</h3>
                  <div className="mt-4 h-1 w-12 bg-gold rounded-full group-hover:w-20 transition-all"></div>
                </div>
                <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-xl group hover:border-gold/30 transition-all">
                  <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase mb-2 tracking-widest">Active Orders</p>
                  <h3 className="text-2xl md:text-4xl font-black text-white">{activeOrdersCount}</h3>
                  <div className="mt-4 h-1 w-12 bg-gold rounded-full group-hover:w-20 transition-all"></div>
                </div>
              </div>
              
              <div className="bg-slate-900/50 p-6 md:p-8 rounded-[2rem] border border-white/10">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Performance Snapshot</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                           <i className="fa-solid fa-users"></i>
                        </div>
                        <span className="text-sm font-bold">Total Customers</span>
                     </div>
                     <span className="font-black text-blue-400">124</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
                           <i className="fa-solid fa-box"></i>
                        </div>
                        <span className="text-sm font-bold">Stock Items</span>
                     </div>
                     <span className="font-black text-green-400">{products.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory View */}
          {activeTab === 'inventory' && (
            <div className="bg-slate-900 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h3 className="text-lg md:text-xl font-bold">Inventory</h3>
                <button onClick={() => openModal()} className="bg-gold text-navy px-5 md:px-8 py-2 md:py-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  Add Item
                </button>
              </div>

              {/* Table for Desktop, Cards for Mobile */}
              <div className="block md:hidden p-4 space-y-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={p.image} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{p.category}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-y border-white/5">
                      <div>
                        <p className="text-[8px] text-slate-500 font-black uppercase">Price</p>
                        <p className="font-black text-gold">৳{p.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-slate-500 font-black uppercase">Stock</p>
                        <p className="font-black text-white">{p.stock}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(p)} className="flex-1 bg-slate-800 py-3 rounded-xl text-xs font-bold text-blue-400">
                        <i className="fa-solid fa-pen mr-2"></i> Edit
                      </button>
                      <button onClick={() => onDeleteProduct(p.id)} className="flex-1 bg-red-500/10 py-3 rounded-xl text-xs font-bold text-red-400">
                        <i className="fa-solid fa-trash mr-2"></i> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase text-slate-500 bg-black/40 tracking-widest">
                      <th className="p-6">Product Information</th>
                      <th className="p-6">Price</th>
                      <th className="p-6">In Stock</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-6 flex items-center gap-4 min-w-[250px]">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                          <div>
                            <p className="font-bold text-white">{p.name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-black">{p.category}</p>
                          </div>
                        </td>
                        <td className="p-6 font-bold">৳{p.price}</td>
                        <td className="p-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black ${p.stock > 5 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                             {p.stock}
                           </span>
                        </td>
                        <td className="p-6 text-right space-x-2">
                          <button onClick={() => openModal(p)} className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-lg transition-colors"><i className="fa-solid fa-pen"></i></button>
                          <button onClick={() => onDeleteProduct(p.id)} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors"><i className="fa-solid fa-trash"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders View */}
          {activeTab === 'orders' && (
            <div className="bg-slate-900 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 md:p-8 border-b border-white/10 bg-black/20">
                <h3 className="text-lg md:text-xl font-bold text-white">Logistics & Orders</h3>
              </div>

              {/* Responsive Card-view for Mobile */}
              <div className="block md:hidden p-4 space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gold font-black text-xs uppercase tracking-widest">#{o.id.slice(-6)}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{new Date(o.date).toLocaleString()}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${
                        o.status === 'Pending' ? 'bg-amber-500/20 text-amber-500' : 
                        o.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' : 
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {o.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{o.userName}</p>
                      <p className="text-xs text-slate-400"><i className="fa-solid fa-phone mr-2"></i>{o.shippingAddress?.phone}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 italic"><i className="fa-solid fa-location-dot mr-2"></i>{o.shippingAddress?.district}, {o.shippingAddress?.details}</p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <p className="font-black text-lg">৳{o.total.toLocaleString()}</p>
                      <button 
                        onClick={() => copyOrderDetails(o)}
                        className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${copyFeedback === o.id ? 'text-green-400' : 'text-gold'}`}
                      >
                        <i className={`fa-solid ${copyFeedback === o.id ? 'fa-check' : 'fa-copy'}`}></i>
                        {copyFeedback === o.id ? 'Copied' : 'Details'}
                      </button>
                    </div>

                    <select 
                      onChange={(e) => onUpdateOrder(o.id, e.target.value as any)}
                      className="w-full bg-slate-800 border-none rounded-xl p-3 text-xs outline-none font-bold text-white"
                      value={o.status}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase text-slate-500 bg-black/40 tracking-widest">
                    <tr>
                      <th className="p-6">Order Reference</th>
                      <th className="p-6">Customer Details</th>
                      <th className="p-6">Total Amount</th>
                      <th className="p-6">Fulfilment</th>
                      <th className="p-6 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-6">
                          <p className="text-gold font-bold tracking-widest">#{o.id.slice(-6)}</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">{new Date(o.date).toLocaleDateString()}</p>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-white">{o.userName}</p>
                          <p className="text-xs text-slate-400">{o.shippingAddress?.phone}</p>
                          <button 
                            onClick={() => copyOrderDetails(o)}
                            className={`mt-2 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${copyFeedback === o.id ? 'text-green-400' : 'text-gold hover:opacity-70'}`}
                          >
                            <i className={`fa-solid ${copyFeedback === o.id ? 'fa-check' : 'fa-copy'}`}></i>
                            {copyFeedback === o.id ? 'Information Copied' : 'Copy All Details'}
                          </button>
                        </td>
                        <td className="p-6 font-black text-white">৳{o.total.toLocaleString()}</td>
                        <td className="p-6">
                          <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${
                            o.status === 'Pending' ? 'bg-amber-500/20 text-amber-500' : 
                            o.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <select 
                            onChange={(e) => onUpdateOrder(o.id, e.target.value as any)}
                            className="bg-slate-800 border border-white/10 rounded-lg p-2 text-xs outline-none font-bold"
                            value={o.status}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <form onSubmit={handleFormSubmit} className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 md:p-10 w-full max-w-2xl space-y-5 md:space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-gold">{editingProduct ? 'Edit Product' : 'New Listing'}</h2>
               <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Name</label>
                <input name="name" defaultValue={editingProduct?.name} required placeholder="Product Title" className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-gold/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Category</label>
                <input name="category" defaultValue={editingProduct?.category} required placeholder="Ex: Serums" className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-gold/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Price (৳)</label>
                <input name="price" type="number" defaultValue={editingProduct?.price} required placeholder="Price" className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-gold/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Stock Level</label>
                <input name="stock" type="number" defaultValue={editingProduct?.stock} required placeholder="Quantity" className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-gold/50" />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Image URL</label>
              <input 
                name="image" 
                value={imagePreview || ''} 
                onChange={(e) => setImagePreview(e.target.value)}
                placeholder="https://..." 
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-gold/50" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Product Description</label>
              <textarea name="desc" defaultValue={editingProduct?.description} required placeholder="Detailed description..." className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm h-32 outline-none focus:border-gold/50 resize-none" />
            </div>

            <button type="submit" className="w-full py-5 bg-gold text-navy font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all">
              {editingProduct ? 'Commit Changes' : 'Initialize Listing'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
