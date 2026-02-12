
import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../supabase';

interface CustomerLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const CustomerLogin: React.FC<CustomerLoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        // Sign Up with unique email check
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', formData.email.toLowerCase())
          .maybeSingle();

        if (existingUser) throw new Error("An account with this email already exists.");

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          email: formData.email.toLowerCase(),
          addresses: [],
          wishlist: [],
          skinProfile: { type: '', concerns: [] },
          rewardPoints: 0,
          joinedAt: new Date().toISOString()
        };

        const { error: insertError } = await supabase.from('users').insert([
          { 
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            password: formData.password, 
            addresses: newUser.addresses, 
            reward_points: newUser.rewardPoints,
            skin_profile: newUser.skinProfile,
            joined_at: newUser.joinedAt
          }
        ]);

        if (insertError) throw new Error("Could not create account. Please try again.");
        onLogin(newUser);
      } else {
        // Secure Login Logic
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', formData.email.toLowerCase())
          .eq('password', formData.password)
          .maybeSingle();

        if (error || !data) throw new Error("Invalid email or password.");
        
        const loggedInUser: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          addresses: data.addresses || [],
          wishlist: data.wishlist || [],
          skinProfile: data.skin_profile || { type: '', concerns: [] },
          rewardPoints: data.reward_points || 0,
          joinedAt: data.joined_at
        };
        onLogin(loggedInUser);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-user-lock text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-navy">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-gray-400 text-sm mt-2">Your information is secure with us.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Enter your full name"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-gold outline-none transition text-navy"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
              <input 
                required
                type="email" 
                placeholder="example@mail.com"
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-gold outline-none transition text-navy"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Password</label>
              <input 
                required
                type="password" 
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-gold outline-none transition text-navy"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold text-center border border-red-100 flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                {errorMsg}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-navy text-white font-bold rounded-2xl shadow-xl hover:bg-gold hover:text-navy transition-all active:scale-95 mt-4 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>{isSignUp ? 'Sign Up' : 'Login'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }}
              className="text-xs font-bold text-navy hover:text-gold transition border-b border-navy/20"
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
