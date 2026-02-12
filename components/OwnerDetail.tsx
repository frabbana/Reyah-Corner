
import React from 'react';

interface OwnerDetailProps {
  isOpen: boolean;
  onClose: () => void;
}

const OwnerDetail: React.FC<OwnerDetailProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 z-[150] transition-all duration-700 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      {/* Background with Dark Glassmorphism effect */}
      <div className="absolute inset-0 bg-[#000a1a]/95 backdrop-blur-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-[#c5a059]/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[#00122e]/40 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="relative h-full flex flex-col border-t border-white/10">
        {/* Header bar */}
        <div className="p-6 md:p-10 flex justify-between items-center text-white border-b border-white/5">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-[#00122e] border border-white/10 rounded-xl flex items-center justify-center font-serif text-[#c5a059] text-xl shadow-2xl">RC</div>
             <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">Reyah Corner Identity</span>
          </div>
          <button 
            onClick={onClose} 
            className="w-14 h-14 bg-white/5 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#c5a059] hover:text-[#00122e] transition-all duration-300 group shadow-lg"
          >
            <i className="fa-solid fa-xmark text-xl group-hover:rotate-90 transition-transform"></i>
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto px-6 py-10">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            
            {/* Owner Visual Representation */}
            <div className="lg:w-1/3 w-64 relative group flex-shrink-0">
              <div className="absolute -inset-6 bg-[#c5a059]/20 rounded-[3.5rem] blur-3xl group-hover:bg-[#c5a059]/30 transition-all duration-1000"></div>
              
              <div className="relative z-10 aspect-[4/5] rounded-[3rem] bg-[#000a1a] border border-white/10 flex items-center justify-center shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden">
                 <div className="w-full h-full flex items-center justify-center bg-[#00122e] text-white font-serif text-8xl transition-transform duration-1000 group-hover:scale-110">
                    UT
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                 
                 {/* Premium subtle framing */}
                 <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#c5a059]/30 rounded-tr-3xl"></div>
                 <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#c5a059]/30 rounded-bl-3xl"></div>
              </div>
              
              {/* Premium Floating Badge */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#c5a059] text-[#00122e] rounded-2xl flex items-center justify-center shadow-2xl border-4 border-[#000a1a] z-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <i className="fa-solid fa-crown text-xl"></i>
              </div>
            </div>

            {/* Biography & Vision */}
            <div className="flex-1 text-white space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <span className="text-[#c5a059] font-bold uppercase tracking-[0.4em] text-[10px]">Behind the Brand</span>
                <h2 className="text-5xl md:text-7xl font-bold font-serif leading-tight text-white">Umme Tamima</h2>
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="w-10 h-px bg-[#c5a059]/30"></div>
                  <p className="text-sm md:text-lg text-[#c5a059] font-medium tracking-widest uppercase">Founder & Visionary</p>
                  <div className="w-10 h-px bg-[#c5a059]/30"></div>
                </div>
              </div>

              <div className="space-y-6 text-white/70 text-lg leading-relaxed font-light italic max-w-2xl mx-auto lg:mx-0">
                <p>
                  "Beauty is not just about appearances; it is a reflection of how we care for the soul and the body Allah has gifted us. Reyah Corner was born from a desire to bring 'Barakah' back into our daily self-care routines."
                </p>
                <div className="not-italic text-white/90 text-sm md:text-base border-l-2 border-[#c5a059]/40 pl-6 py-5 bg-white/5 backdrop-blur-sm rounded-r-3xl text-left border border-white/5">
                  Umme Tamima is a visionary entrepreneur who believes in purity and gentleness. She believes that the true sanctuary for our skin is found within nature. Reyah Corner is more than just a brand; it is Tamima’s dream—where trust and quality stand above all.
                </div>
              </div>

              {/* Pillars Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                {[
                  { icon: 'fa-heart', label: 'Trust', desc: 'Reliable Ingredients' },
                  { icon: 'fa-gem', label: 'Quality', desc: 'Premium Standards' },
                  { icon: 'fa-leaf', label: 'Simplicity', desc: 'Natural Ease' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] group hover:border-[#c5a059]/40 hover:bg-white/[0.06] transition-all text-center">
                    <i className={`fa-solid ${item.icon} text-[#c5a059] text-xl mb-4 group-hover:scale-125 transition-transform duration-500`}></i>
                    <h4 className="font-bold text-white mb-1 uppercase tracking-[0.2em] text-[11px]">{item.label}</h4>
                    <p className="text-[10px] text-white/40">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Social Connections */}
              <div className="pt-8 flex flex-col sm:flex-row gap-8 justify-center lg:justify-start">
                <a 
                  href="https://www.facebook.com/umme.tamima.1238" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-4 text-white group hover:text-[#c5a059] transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#c5a059] group-hover:text-[#00122e] group-hover:scale-110 transition-all duration-300">
                    <i className="fa-brands fa-facebook-f text-lg"></i>
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] font-black uppercase tracking-widest text-white/30">Personal Profile</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest">Connect on Facebook</span>
                  </div>
                </a>

                <a 
                  href="https://www.facebook.com/reyahcorner" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-4 text-white group hover:text-[#c5a059] transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#c5a059] group-hover:text-[#00122e] group-hover:scale-110 transition-all duration-300">
                    <i className="fa-solid fa-store text-lg"></i>
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] font-black uppercase tracking-widest text-white/30">Official Brand</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest">Visit our Page</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer info inside the drawer */}
        <div className="p-10 border-t border-white/5 text-center bg-black/20">
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.6em]">Reyah Corner - A Sanctuary of Barakah</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDetail;
