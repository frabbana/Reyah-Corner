
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface HeroProps {
  latestProduct?: Product | null;
  onShopClick: (e: React.MouseEvent) => void;
  onOpenOwnerPage: () => void;
  onViewProduct?: (product: Product) => void;
}

const Hero: React.FC<HeroProps> = ({ latestProduct, onShopClick, onOpenOwnerPage, onViewProduct }) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (latestProduct) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [latestProduct]);

  return (
    <section id="home" className="relative pt-24 overflow-hidden bg-[#fdf2f2]">
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-[45vw] h-[45vw] bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-[35vw] h-[35vw] bg-gold/5 rounded-full translate-x-1/4 translate-y-1/4 blur-[120px] opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12 md:gap-20">
        
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left z-10 space-y-8">
          <div className="inline-flex items-center space-x-3 px-5 py-2 bg-white/80 backdrop-blur-md shadow-sm border border-white rounded-full animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/60">The Sanctuary of Purity</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-navy leading-[0.95] tracking-tighter">
              A corner of <br />
              <span className="text-gold font-serif italic font-normal tracking-normal">calm & barakah</span>
            </h1>
            <div className="flex items-center justify-center lg:justify-start space-x-5 pt-2">
              <div className="h-px w-10 bg-gold/40"></div>
              <p className="text-[10px] md:text-xs text-navy/40 font-bold tracking-[0.6em] uppercase">
                Trust <span className="text-gold opacity-100 mx-2">•</span> Quality <span className="text-gold opacity-100 mx-2">•</span> Simplicity
              </p>
              <div className="h-px w-10 bg-gold/40"></div>
            </div>
          </div>

          <p className="text-navy/60 text-lg md:text-xl font-light max-w-lg mx-auto lg:mx-0 leading-relaxed italic">
            "Experience skincare that respects your purity, crafted with natural elements and the essence of Barakah."
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 justify-center lg:justify-start pt-6">
            <button 
              onClick={onShopClick} 
              className="group relative px-12 py-5 bg-navy text-white font-bold rounded-[2rem] shadow-2xl hover:shadow-navy/30 active:scale-95 text-center overflow-hidden transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span className="tracking-[0.2em] uppercase text-xs">Explore Collection</span>
                <i className="fa-solid fa-arrow-right-long text-sm group-hover:translate-x-2 transition-transform"></i>
              </span>
            </button>
            
            <button 
              onClick={onOpenOwnerPage}
              className="flex items-center justify-center space-x-5 px-8 py-4 bg-white/50 border border-white rounded-[2rem] shadow-sm hover:shadow-xl hover:bg-white hover:border-gold/20 transition-all active:scale-95 group"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold/40 shadow-inner bg-navy flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                 <span className="text-white font-serif text-lg">UT</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-navy leading-none group-hover:text-gold transition-colors">Umme Tamima</p>
                <p className="text-[9px] text-gold font-black uppercase tracking-[0.3em] mt-2">Founder's Vision</p>
              </div>
            </button>
          </div>
        </div>

        {/* Visual Content */}
        <div className="flex-1 relative w-full max-w-lg mx-auto lg:max-w-xl">
          <div className="relative group">
            {/* Elegant Aura Effect */}
            <div className="absolute -inset-8 bg-white/60 rounded-[4rem] rotate-3 transition-all group-hover:rotate-0 duration-1000 blur-2xl opacity-50"></div>
            <div className="absolute -inset-2 bg-gold/10 rounded-[4rem] -rotate-3 transition-all group-hover:rotate-0 duration-1000 blur-lg opacity-30"></div>
            
            <div className="relative z-10 overflow-hidden rounded-[3rem] shadow-[0_50px_100px_rgba(0,18,46,0.12)] border-[12px] border-white group-hover:scale-[1.03] transition-all duration-1000 ease-out">
              <img 
                src="Hero_image.jpg" 
                alt="Reyah Corner Premium Skin Care Products" 
                className="w-full h-auto object-cover aspect-square scale-105 group-hover:scale-100 transition-transform duration-[2000ms]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('unsplash')) {
                    target.src = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEha0EAZArjsTlq6mT_huOTjtZcif5Kji4Kqdc2beZ7NKpAWt0p0jTJ_G41zGmqNILqfKg9dm3JvwD0DMikUZFPB-BKzWCwCFTLb-PD2zZjonWfx7ux8v-NmdVPdRpwgVeUbaqZAg-DiQcaBQcbnH4tZ6n6s_de5KKmnRB_zKcVNFQmpsOpq718P0omAmkY/s3264/Hero_image.jpg";
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
            </div>

            {/* Dynamic New Product Notification */}
            {latestProduct && showNotification && (
              <div className="absolute -top-10 -left-6 md:-left-12 z-30 animate-in slide-in-from-left-4 fade-in duration-700">
                <button 
                  onClick={() => onViewProduct?.(latestProduct)}
                  className="bg-white/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-gold/20 flex items-center space-x-4 hover:scale-105 transition-transform"
                >
                  <img src={latestProduct.image} className="w-12 h-12 rounded-xl object-cover" alt="New" />
                  <div className="text-left pr-4">
                    <p className="text-[8px] font-black uppercase text-gold tracking-widest">New Arrival</p>
                    <p className="text-[10px] font-bold text-navy truncate max-w-[100px]">{latestProduct.name}</p>
                  </div>
                </button>
              </div>
            )}

            {/* Premium Interactive Badges */}
            <div className="absolute -top-10 -right-4 md:-right-10 bg-white/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl z-20 border border-white animate-float-slow max-w-[150px]">
               <div className="flex flex-col items-center text-center space-y-2">
                 <div className="w-12 h-12 bg-navy text-gold rounded-full flex items-center justify-center shadow-lg border border-gold/10">
                    <i className="fa-solid fa-medal text-lg"></i>
                 </div>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Purity Standard</p>
                 <p className="text-[11px] font-bold text-navy">Premium Grade</p>
               </div>
            </div>

            <div className="absolute bottom-12 -left-6 md:-left-12 bg-navy p-6 rounded-[2.5rem] shadow-2xl z-20 border border-navy/50 animate-bounce-gentle min-w-[140px]">
               <div className="text-center text-white space-y-1">
                 <div className="text-3xl font-serif italic text-gold leading-none">100%</div>
                 <p className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">Organic Elements</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 5s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default Hero;
