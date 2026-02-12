
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (user: string, pass: string) => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'reyah2024') {
      onLogin(username, password);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-md bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white overflow-hidden transition-all duration-500 ${error ? 'animate-shake' : 'animate-in fade-in zoom-in-95'}`}>
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-sage rounded-3xl flex items-center justify-center mx-auto mb-6 text-black shadow-inner border border-white">
              <i className="fa-solid fa-shield-halved text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-black tracking-tight">Admin Authentication</h2>
            <p className="text-sm text-gray-500 mt-2 italic">Accessing Reyah Corner Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Username</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl ring-1 ring-gray-100 focus:ring-2 focus:ring-sage-dark outline-none transition text-black"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Password</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl ring-1 ring-gray-100 focus:ring-2 focus:ring-sage-dark outline-none transition text-black"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 text-center font-bold animate-pulse">
                Incorrect username or password! Please try again.
              </p>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-sage text-black font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95 mt-4 border border-sage-dark/10"
            >
              Access Dashboard
            </button>
          </form>

          <button 
            onClick={onClose}
            className="w-full mt-6 text-sm text-black hover:text-gray-600 transition font-medium"
          >
            Cancel and Return
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
