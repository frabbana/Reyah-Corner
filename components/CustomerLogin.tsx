
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
  const [verificationSent, setVerificationSent] = useState(false);
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
        // 1. Supabase Auth Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email.toLowerCase(),
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // 2. Pre-create the user profile in the public 'users' table
          // Note: If email verification is enabled, the user might not be 'fully' logged in yet
          const { error: profileError } = await supabase.from('users').insert([{
            id: authData.user.id,
            name: formData.name,
            email: formData.email.toLowerCase(),
            addresses: [],
            reward_points: 0,
            skin_profile: { type: '', concerns: [] },
            joined_at: new Date().toISOString()
          }]);

          // We ignore profileError if it's a conflict, as the user might be retrying
          if (profileError && profileError.code !== '23505') {
            console.error("Profile creation error:", profileError);
          }

          setVerificationSent(true);
        }
      } else {
        // Supabase Auth Login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email.toLowerCase(),
          password: formData.password,
        });

        if (authError) {
          if (authError.message.includes("Email not confirmed")) {
            throw new Error("Please verify your email address before logging in.");
          }
          throw authError;
        }

        if (authData.user) {
          // Fetch the full profile from the 'users' table
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          if (profileData) {
            const loggedInUser: User = {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              phone: profileData.phone,
              addresses: profileData.addresses || [],
              wishlist: profileData.wishlist || [],
              skinProfile: profileData.skin_profile || { type: '', concerns: [] },
              rewardPoints: profileData.reward_points || 0,
              joinedAt: profileData.joined_at
            };
            onLogin(loggedInUser);
            onClose();
          } else {
            // If somehow the profile wasn't created during signup, create it now
            const newUser: User = {
              id: authData.user.id,
              name: authData.user.user_metadata.full_name || 'Valued Customer',
              email: authData.user.email || '',
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
              addresses: newUser.addresses,
              reward_points: newUser.rewardPoints,
              skin_profile: newUser.skinProfile,
              joined_at: newUser.joinedAt
            }]);
            
            onLogin(newUser);
            onClose();
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8 md:p-12">
          {verificationSent ? (
            <div className="text-center space-y-8 py-6">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <i className="fa-solid fa-envelope-circle-check text-4xl"></i>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-navy">Check Your Email</h2>
                <p className="text-sm text-gray-500 leading-relaxed px-4">
                  We've sent a verification link to <span className="font-bold text-navy">{formData.email}</span>. Please verify your account to continue.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-navy text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                Close and Check Inbox
              </button>
              <button 
                onClick={() => setVerificationSent(false)}
                className="text-xs font-bold text-gray-400 hover:text-navy transition"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
