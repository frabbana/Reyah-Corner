
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message } from '../types';

interface GeminiConsultantProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeminiConsultant: React.FC<GeminiConsultantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm Reyah's AI Skin Consultant. How can I help you find your glow today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Fix: Always use process.env.API_KEY directly in the initialization object.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, userMsg].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `You are an expert skin consultant for "Reyah Corner". 
          Your goal is to provide personalized skincare advice and product recommendations from the Reyah Corner collection.
          Collection items: Hydrating Petal Serum, Gentle Oat Cleanser, Glow Vit-C Toner, Moisture Lock Cream, Botanical Face Oil, Clay Detox Mask.
          Keep responses friendly, helpful, and concise. Always mention Reyah Corner products if they fit the user's concerns.`,
          temperature: 0.7,
        }
      });

      const aiText = response.text || "I apologize, I'm having trouble processing that right now.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error('Gemini error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm experiencing some technical difficulties. Please make sure your connection is stable and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] animate-in fade-in zoom-in duration-200">
        <div className="p-4 md:p-6 bg-dusty-pink flex justify-between items-center border-b border-pink-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-sm">
              <i className="fa-solid fa-sparkles"></i>
            </div>
            <div>
              <h2 className="font-bold text-black text-sm md:text-base">Skin Consultant</h2>
              <p className="text-[10px] text-black font-medium opacity-70">Powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition active:scale-90 text-black">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-sage-dark text-black rounded-tr-none shadow-md' 
                  : 'bg-white text-black shadow-sm border border-gray-100 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex space-x-1">
                <div className="w-1.5 h-1.5 bg-black/30 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-black/30 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-black/30 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-2xl border border-gray-200 focus-within:border-sage-dark transition-colors">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about skincare..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 outline-none text-black placeholder:text-gray-400"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center disabled:opacity-50 transition active:scale-95 shadow-sm border border-gray-200"
              aria-label="Send message"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiConsultant;
