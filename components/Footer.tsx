import React from 'react';

interface FooterProps {
  onShopClick?: (e: React.MouseEvent) => void;
  onHomeClick?: (e: React.MouseEvent) => void;
  onToggleAdmin?: () => void;
  isAdminAuthenticated?: boolean;
}

const Footer: React.FC<FooterProps> = ({ 
  onShopClick, 
  onHomeClick, 
  onToggleAdmin, 
  isAdminAuthenticated 
}) => {
  return (
    <footer className="bg-navy text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 logo-premium rounded-2xl flex items-center justify-center shadow-xl border border-gold/30">
                <span className="text-white font-serif text-2xl font-bold">RC</span>
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold tracking-[0.2em] text-white leading-none">REYAH</h2>
                <p className="text-[10px] font-bold tracking-[0.5em] text-gold uppercase mt-1">Corner</p>
              </div>
            </div>
            
            <p className="text-white/60 mb-8 max-w-sm text-lg leading-relaxed font-light italic">
              "We believe beauty is rooted in purity and barakah. Reyah Corner is your sanctuary for nature-inspired, premium skincare."
            </p>
            
            <div className="flex space-x-6">
              {['instagram', 'facebook', 'whatsapp', 'tiktok'].map(social => (
                <a key={social} href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-gold hover:text-navy hover:border-gold transition-all duration-300">
                  <i className={`fa-brands fa-${social === 'whatsapp' ? 'whatsapp' : social}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-gold uppercase tracking-[0.3em] text-xs">Discover</h4>
            <ul className="space-y-4 text-white/50 font-medium">
              <li><button onClick={onHomeClick} className="hover:text-gold transition-colors text-left w-full">The Experience</button></li>
              <li><button onClick={onShopClick} className="hover:text-gold transition-colors text-left w-full">Our Collection</button></li>
              <li><a href="#" className="hover:text-gold transition-colors">Our Philosophy</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Join the Circle</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-gold uppercase tracking-[0.3em] text-xs">Care</h4>
            <ul className="space-y-4 text-white/50 font-medium">
              <li><a href="#" className="hover:text-gold transition-colors">Track Shipment</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Skin Consultation</a></li>
              <li><button onClick={onToggleAdmin} className="hover:text-gold transition-colors text-left w-full flex items-center space-x-2">
                <i className={`fa-solid ${isAdminAuthenticated ? 'fa-user-gear' : 'fa-lock'} text-[10px]`}></i>
                <span>{isAdminAuthenticated ? 'Admin Dashboard' : 'Staff Portal'}</span>
              </button></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-white/30 font-bold uppercase tracking-[0.3em]">
          <p>© 2024 Reyah Corner Skincare. Crafted with barakah.</p>
          <div className="mt-6 md:mt-0 flex space-x-8">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <i className="fa-solid fa-phone-volume text-gold group-hover:scale-125 transition-transform"></i>
              <span className="group-hover:text-white transition-colors">+880 1XXX-XXXXXX</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-pointer">
              <i className="fa-solid fa-envelope-open-text text-gold group-hover:scale-125 transition-transform"></i>
              <span className="group-hover:text-white transition-colors">hello@reyahcorner.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;