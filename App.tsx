
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import GeminiConsultant from './components/GeminiConsultant';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import OwnerDetail from './components/OwnerDetail';
import CustomerLogin from './components/CustomerLogin';
import CustomerProfile from './components/CustomerProfile';
import CategoryFilter from './components/CategoryFilter';
import CheckoutReview from './components/CheckoutReview';
import { Product, CartItem, User, Order, Address, PaymentMethod } from './types';
import { PRODUCTS } from './constants';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [isOwnerPageOpen, setIsOwnerPageOpen] = useState(false);
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);
  const [isCustomerProfileOpen, setIsCustomerProfileOpen] = useState(false);
  const [isCheckoutReviewOpen, setIsCheckoutReviewOpen] = useState(false);
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const mapDbOrderToAppOrder = (o: any): Order => ({
    id: o.id,
    userId: o.user_id,
    userName: o.user_name,
    items: o.items,
    total: o.total,
    date: o.date,
    status: o.status,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    transactionId: o.transaction_id,
    shippingAddress: o.shipping_address,
    trackingId: o.tracking_id,
    courier: o.courier
  });

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    if (data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        addresses: data.addresses || [],
        wishlist: data.wishlist || [],
        skinProfile: data.skin_profile || { type: '', concerns: [] },
        rewardPoints: data.reward_points || 0,
        joinedAt: data.joined_at
      } as User;
    }
    return null;
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Products
        const { data: dbProducts } = await supabase.from('products').select('*');
        if (dbProducts && dbProducts.length > 0) setProductsList(dbProducts);
        else setProductsList(PRODUCTS);

        // 2. Initial Auth Session Check
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) setCurrentUser(profile);
        }

        // 3. Setup Auth Listener
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              setCurrentUser(profile);
            } else {
              // Create profile if missing (safety net for email verification)
              const newUser: User = {
                id: session.user.id,
                name: session.user.user_metadata.full_name || 'Customer',
                email: session.user.email || '',
                addresses: [],
                wishlist: [],
                skinProfile: { type: '', concerns: [] },
                rewardPoints: 0,
                joinedAt: new Date().toISOString()
              };
              await supabase.from('users').insert([{
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                joined_at: newUser.joinedAt
              }]);
              setCurrentUser(newUser);
            }
          } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
          }
        });

        // 4. Cart recovery
        const savedCart = localStorage.getItem('reyah-cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        // 5. Admin recovery
        const adminSession = localStorage.getItem('reyah-admin-auth');
        if (adminSession === 'true') {
          setIsAdminAuthenticated(true);
          const { data: dbOrders } = await supabase.from('orders').select('*').order('date', { ascending: false });
          if (dbOrders) setOrders(dbOrders.map(mapDbOrderToAppOrder));
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);

  useEffect(() => {
    localStorage.setItem('reyah-cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  const scrollToShop = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsAdminMode(false);
    const shopSection = document.getElementById('shop');
    if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHome = () => {
    setIsAdminMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast(`Sorry, "${product.name}" is currently out of stock.`);
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast(`Maximum available stock reached.`);
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`"${product.name}" added to your bag!`);
  };

  const finalizeOrder = async (shippingAddress: Address, paymentMethod: PaymentMethod, transactionId?: string) => {
    if (!currentUser) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrderData = {
      id: Math.random().toString(36).substr(2, 12).toUpperCase(),
      user_id: currentUser.id,
      user_name: currentUser.name,
      items: cart,
      total,
      status: 'Pending',
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'COD' ? 'Unpaid' : 'Verification Required',
      transaction_id: transactionId || null,
      shipping_address: shippingAddress
    };

    const { error } = await supabase.from('orders').insert([newOrderData]);

    if (!error) {
      for (const item of cart) {
        await supabase.from('products').update({ stock: item.stock - item.quantity }).eq('id', item.id);
      }
      
      const pointsEarned = Math.floor(total / 100);
      const updatedUser = { ...currentUser, rewardPoints: currentUser.rewardPoints + pointsEarned };
      await supabase.from('users').update({ reward_points: updatedUser.rewardPoints }).eq('id', currentUser.id);
      
      const appOrder = mapDbOrderToAppOrder(newOrderData);
      setOrders([appOrder, ...orders]);
      setCart([]);
      setCurrentUser(updatedUser);
      setIsCheckoutReviewOpen(false);
      showToast("Order placed successfully!");
      setIsCustomerProfileOpen(true);
    } else {
      console.error("Order insertion error:", error);
      showToast("Could not place order. Please check your connection.");
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const { error } = await supabase.from('users').update({
      name: updatedUser.name,
      phone: updatedUser.phone,
      addresses: updatedUser.addresses,
      wishlist: updatedUser.wishlist,
      skin_profile: updatedUser.skinProfile,
      reward_points: updatedUser.rewardPoints
    }).eq('id', updatedUser.id);

    if (!error) {
      setCurrentUser(updatedUser);
    } else {
      showToast("Could not update information in database.");
    }
  };

  const handleAdminToggle = () => {
    if (isAdminAuthenticated) setIsAdminMode(!isAdminMode);
    else setShowLoginOverlay(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
    localStorage.removeItem('reyah-admin-auth');
    showToast("Logged out from admin panel.");
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      showToast(`Order status updated to ${status}.`);
    }
  };

  const handleLoginSuccess = async () => {
    setIsAdminAuthenticated(true);
    setIsAdminMode(true);
    setShowLoginOverlay(false);
    localStorage.setItem('reyah-admin-auth', 'true');
    const { data: dbOrders } = await supabase.from('orders').select('*').order('date', { ascending: false });
    if (dbOrders) setOrders(dbOrders.map(mapDbOrderToAppOrder));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsCustomerProfileOpen(false);
  };

  const handleCheckoutInitiation = () => {
    if (!currentUser) {
      setIsCustomerLoginOpen(true);
      setIsCartOpen(false);
    } else {
      setIsCheckoutReviewOpen(true);
      setIsCartOpen(false);
    }
  };

  const filteredProducts = productsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#fdf2f2] space-y-4">
        <div className="w-16 h-16 logo-premium rounded-2xl flex items-center justify-center animate-pulse">
           <span className="text-white font-serif text-2xl">RC</span>
        </div>
        <p className="text-navy font-bold text-xs uppercase tracking-[0.4em] animate-bounce">Securing Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
        onConsultantClick={() => setIsConsultantOpen(true)}
        onHomeClick={scrollToHome}
        onShopClick={scrollToShop}
        currentUser={currentUser}
        onUserClick={() => currentUser ? setIsCustomerProfileOpen(true) : setIsCustomerLoginOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        allProducts={productsList}
        onViewProduct={setSelectedProduct}
      />

      <main className="relative z-10">
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] transition-all duration-700 ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="bg-navy text-white px-8 py-5 rounded-[2rem] shadow-2xl border border-gold/30 flex items-center space-x-5">
            <div className="w-10 h-10 bg-gold text-navy rounded-full flex items-center justify-center shadow-lg"><i className="fa-solid fa-check"></i></div>
            <p className="font-bold text-sm">{toast.message}</p>
          </div>
        </div>

        {isAdminMode && isAdminAuthenticated ? (
          <AdminPanel 
            products={productsList} 
            orders={orders}
            users={[]} 
            onAddProduct={async (p) => {
              const { error } = await supabase.from('products').insert([p]);
              if (!error) setProductsList([p, ...productsList]);
            }} 
            onDeleteProduct={async (id) => {
              const { error } = await supabase.from('products').delete().eq('id', id);
              if (!error) setProductsList(productsList.filter(p => p.id !== id));
            }} 
            onUpdateOrder={handleUpdateOrderStatus}
            onUpdateStock={async (id, qty) => {
              const { error } = await supabase.from('products').update({ stock: qty }).eq('id', id);
              if (!error) setProductsList(prev => prev.map(p => p.id === id ? { ...p, stock: qty } : p));
            }}
            onUpdateProduct={async (p) => {
              const { error } = await supabase.from('products').update(p).eq('id', p.id);
              if (!error) setProductsList(prev => prev.map(old => old.id === p.id ? p : old));
            }}
            onExit={() => setIsAdminMode(false)}
            onLogout={handleAdminLogout}
          />
        ) : (
          <>
            <Hero latestProduct={lastAddedProduct} onShopClick={scrollToShop} onOpenOwnerPage={() => setIsOwnerPageOpen(true)} onViewProduct={setSelectedProduct} />
            <Features />
            <section id="shop" className="py-24 scroll-mt-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CategoryFilter categories={Array.from(new Set(productsList.map(p => p.category))).sort()} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} onViewDetails={setSelectedProduct} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer onShopClick={scrollToShop} onHomeClick={scrollToHome} onToggleAdmin={handleAdminToggle} isAdminAuthenticated={isAdminAuthenticated} />
      
      <OwnerDetail isOpen={isOwnerPageOpen} onClose={() => setIsOwnerPageOpen(false)} />
      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} onBuyNow={(p) => { addToCart(p); setIsCartOpen(true); }} />}
      {showLoginOverlay && <AdminLogin onLogin={handleLoginSuccess} onClose={() => setShowLoginOverlay(false)} />}
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={id => setCart(prev => prev.filter(i => i.id !== id))} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onCheckout={handleCheckoutInitiation} currentUser={currentUser} />
      <GeminiConsultant isOpen={isConsultantOpen} onClose={() => setIsConsultantOpen(false)} />
      <CustomerLogin isOpen={isCustomerLoginOpen} onClose={() => setIsCustomerLoginOpen(false)} onLogin={user => setCurrentUser(user)} />
      
      {currentUser && isCheckoutReviewOpen && <CheckoutReview isOpen={isCheckoutReviewOpen} onClose={() => setIsCheckoutReviewOpen(false)} items={cart} user={currentUser} onConfirm={finalizeOrder} onUpdateUser={handleUpdateUser} />}
      
      {currentUser && (
        <CustomerProfile 
          isOpen={isCustomerProfileOpen} 
          onClose={() => setIsCustomerProfileOpen(false)} 
          user={currentUser}
          orders={orders.filter(o => o.userId === currentUser.id)}
          allProducts={productsList}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateUser}
          onAddToCart={addToCart}
          onAddToWishlist={id => handleUpdateUser({...currentUser, wishlist: currentUser.wishlist.includes(id) ? currentUser.wishlist.filter(i => i !== id) : [...currentUser.wishlist, id]})}
        />
      )}
    </div>
  );
};

export default App;
