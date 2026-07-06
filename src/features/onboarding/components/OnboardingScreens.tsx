import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Crown, Phone } from 'lucide-react';

interface OnboardingScreensProps {
  onLogin: () => void;
}

export const OnboardingScreens: React.FC<OnboardingScreensProps> = ({ onLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < 3) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Auto-advance every 3 seconds, but stop at the last slide
  useEffect(() => {
    if (currentSlide === 3) return; // Don't auto-advance on the last slide

    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const slides = [
    {
      title: "DUEL TO BEGIN",
      subtitle: "REAL-TIME BATTLES IN MATH, MEMORY & LOGIC.",
      illustration: (
        <div className="relative w-full h-80 flex items-center justify-center">
          
          {/* Left Avatar (Panda) */}
          <motion.div 
            initial={{ x: -100, opacity: 0, rotate: -20 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}
            className="absolute left-0 z-20 w-28 h-28 bg-white rounded-full border-4 border-[#bde85b] shadow-[0_0_30px_rgba(189,232,91,0.4)] flex items-center justify-center overflow-hidden"
          >
            <svg viewBox="0 0 100 100" className="w-24 h-24 transform translate-y-2">
              {/* Panda Body */}
              <circle cx="50" cy="60" r="35" fill="#333" />
              <circle cx="50" cy="55" r="30" fill="#fff" />
              {/* Ears */}
              <circle cx="25" cy="30" r="12" fill="#333" />
              <circle cx="75" cy="30" r="12" fill="#333" />
              {/* Eyes */}
              <path d="M 30 45 Q 35 40 40 45" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 60 45 Q 65 40 70 45" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
              {/* Nose & Mouth */}
              <circle cx="50" cy="52" r="4" fill="#333" />
              <path d="M 45 58 Q 50 62 55 58" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Controller */}
              <rect x="35" y="65" width="30" height="15" rx="7.5" fill="#3b82f6" />
              <circle cx="42" cy="72.5" r="3" fill="#fff" />
              <circle cx="58" cy="72.5" r="3" fill="#fff" />
            </svg>
          </motion.div>

          {/* Right Avatar (Dog/Wolf) */}
          <motion.div 
            initial={{ x: 100, opacity: 0, rotate: 20 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.3 }}
            className="absolute right-0 z-20 w-28 h-28 bg-white rounded-full border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center overflow-hidden"
          >
            <svg viewBox="0 0 100 100" className="w-24 h-24 transform translate-y-2">
              {/* Dog Body */}
              <path d="M 20 80 Q 50 20 80 80 Z" fill="#94a3b8" />
              <circle cx="50" cy="65" r="25" fill="#f1f5f9" />
              {/* Ears */}
              <path d="M 25 40 L 30 15 L 45 30 Z" fill="#94a3b8" />
              <path d="M 75 40 L 70 15 L 55 30 Z" fill="#94a3b8" />
              {/* Headphones */}
              <path d="M 20 50 A 35 35 0 0 1 80 50" fill="none" stroke="#1e3a8a" strokeWidth="6" />
              <rect x="15" y="40" width="10" height="20" rx="4" fill="#1e3a8a" />
              <rect x="75" y="40" width="10" height="20" rx="4" fill="#1e3a8a" />
              {/* Eyes */}
              <path d="M 35 50 Q 40 45 45 50" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 55 50 Q 60 45 65 50" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
              {/* Nose & Mouth */}
              <circle cx="50" cy="58" r="5" fill="#1e293b" />
              <path d="M 45 65 Q 50 75 55 65" fill="#ef4444" stroke="#333" strokeWidth="2" />
              {/* Controller */}
              <rect x="35" y="75" width="30" height="15" rx="7.5" fill="#94a3b8" stroke="#333" strokeWidth="2" />
              <circle cx="42" cy="82.5" r="2" fill="#333" />
              <circle cx="58" cy="82.5" r="2" fill="#333" />
            </svg>
          </motion.div>

          {/* VS Logo */}
          <div className="absolute z-30 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              {/* V */}
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative mr-6"
              >
                <span className="text-[5rem] font-black italic text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" style={{ fontFamily: 'Impact, sans-serif', WebkitTextStroke: '3px white' }}>
                  V
                </span>
                <span className="text-[5rem] font-black italic absolute top-0 left-0 text-transparent pointer-events-none" style={{ fontFamily: 'Impact, sans-serif', WebkitTextStroke: '1px black' }}>
                  V
                </span>
              </motion.div>

              {/* S */}
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative ml-6 mt-6"
              >
                <span className="text-[5rem] font-black italic text-blue-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]" style={{ fontFamily: 'Impact, sans-serif', WebkitTextStroke: '3px white' }}>
                  S
                </span>
                <span className="text-[5rem] font-black italic absolute top-0 left-0 text-transparent pointer-events-none" style={{ fontFamily: 'Impact, sans-serif', WebkitTextStroke: '1px black' }}>
                  S
                </span>
              </motion.div>

              {/* Lightning Bolt */}
              <motion.div 
                initial={{ scale: 0, opacity: 0, rotate: 15 }}
                animate={{ scale: 1, opacity: 1, rotate: 15 }}
                transition={{ type: "spring", stiffness: 300, damping: 10, delay: 0.8 }}
                className="absolute z-40 ml-6 mt-4"
              >
                <svg width="50" height="110" viewBox="0 0 50 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(250,204,21,1)]">
                  <path d="M30 5L5 60H22L15 105L45 45H28L38 5H30Z" fill="url(#lightningGrad)" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="lightningGrad" x1="25" y1="5" x2="25" y2="105" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FEF08A" />
                      <stop offset="1" stopColor="#EAB308" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative lines */}
          <div className="absolute top-10 left-1/3 w-px h-32 bg-white/20 transform -rotate-[30deg]"></div>
          <div className="absolute bottom-10 right-1/3 w-px h-32 bg-white/20 transform -rotate-[30deg]"></div>
          <div className="absolute top-1/2 left-10 w-32 h-px bg-white/20 transform -rotate-[15deg]"></div>
        </div>
      )
    },
    {
      title: "WIN TO RISE",
      subtitle: "EARN RATING. CLIMB THE LEADERBOARD.",
      illustration: (
        <div className="relative w-full h-80 flex items-end justify-center pb-12">
          {/* Background glow */}
          <div className="absolute top-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]"></div>
          
          {/* Podium */}
          <div className="flex items-end gap-0 h-48 relative z-10">
            <div className="w-20 h-28 bg-[#6366f1] relative flex justify-center border-t border-white/20 shadow-lg">
              <span className="absolute top-4 text-white font-bold text-lg">405</span>
              <div className="absolute -top-10 w-14 h-14 rounded-full bg-gradient-to-br from-[#f472b6] to-[#c084fc] shadow-[0_0_20px_rgba(192,132,252,0.4)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0f172a] transform rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 11 Q 7 14 9 11" />
                  <path d="M13 11 Q 15 14 17 11" />
                  <path d="M11 7 L 11 16 L 8 16" />
                </svg>
                <Crown className="w-5 h-5 text-orange-500 absolute -top-4 -left-2 transform -rotate-12" />
              </div>
            </div>
            <div className="w-24 h-48 bg-[#818cf8] relative flex justify-center border-t border-white/20 shadow-2xl z-10">
              <span className="absolute top-4 text-white font-bold text-xl">605</span>
              <div className="absolute -top-16 w-20 h-20 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#0f172a] transform -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 11 Q 9 14 11 11" />
                  <path d="M15 11 Q 17 14 19 11" />
                  <path d="M13 7 L 13 16 L 16 16" />
                </svg>
                <Crown className="w-8 h-8 text-yellow-400 absolute -top-6 transform rotate-12" />
              </div>
            </div>
            <div className="w-20 h-36 bg-[#4f46e5] relative flex justify-center border-t border-white/20 shadow-lg">
              <span className="absolute top-4 text-white font-bold text-lg">505</span>
              <div className="absolute -top-10 w-14 h-14 rounded-full bg-gradient-to-br from-[#f472b6] to-[#c084fc] shadow-[0_0_20px_rgba(192,132,252,0.4)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0f172a] transform rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 11 Q 7 14 9 11" />
                  <path d="M13 11 Q 15 14 17 11" />
                  <path d="M11 7 L 11 16 L 8 16" />
                </svg>
                <Crown className="w-5 h-5 text-gray-400 absolute -top-4 -right-2 transform rotate-12" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "LEAGUES AND RANKS",
      subtitle: "RISE UP BASED ON PLAYTIME AND SKILL LEVEL",
      illustration: (
        <div className="relative w-full h-80 flex items-center justify-center">
          <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[2rem] transform rotate-45 flex items-center justify-center shadow-[0_0_60px_rgba(234,179,8,0.4)] border-[6px] border-yellow-200/30 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[1.5rem]"></div>
            <div className="transform -rotate-45 relative z-10">
              <svg className="w-20 h-20 text-yellow-900/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 8v8M16 8v8M4 12h16M12 4v16" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "RIP DOOMSCROLLING",
      subtitle: "CHOOSE BRAIN-STIMULATING PLAY.",
      illustration: (
        <div className="relative w-full h-80 flex items-center justify-center">
          <div className="w-56 h-40 bg-gradient-to-br from-indigo-800 to-indigo-950 rounded-2xl transform -rotate-12 skew-x-12 border-t-[6px] border-l-[6px] border-indigo-400/50 shadow-[20px_20px_40px_rgba(0,0,0,0.5)] flex flex-col p-3 gap-3 relative overflow-hidden">
            <div className="absolute top-2 right-4 w-12 h-2 bg-indigo-900 rounded-full"></div>
            <div className="flex-1 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mt-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white/40 ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            <div className="flex-1 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white/40 ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-[#1a1a1c] font-sans text-white relative overflow-hidden">
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-50">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
            <motion.div 
              className="h-full bg-[#bde85b]"
              initial={{ width: i < currentSlide ? '100%' : '0%' }}
              animate={{ width: i <= currentSlide ? '100%' : '0%' }}
              transition={{ duration: i === currentSlide ? 3 : 0.3, ease: "linear" }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
        <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-[#bde85b]/10">
          <Brain className="w-4 h-4 text-[#bde85b]" />
        </div>
        <span className="text-xs font-bold tracking-widest uppercase">Welcome to Brainova</span>
      </div>

      {/* Main Content Carousel */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-6">
        {/* Clickable areas for navigation */}
        <div 
          className="absolute top-0 left-0 bottom-0 w-1/2 z-40 cursor-pointer" 
          onClick={handlePrev}
        />
        <div 
          className="absolute top-0 right-0 bottom-0 w-1/2 z-40 cursor-pointer" 
          onClick={handleNext}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md flex flex-col items-center text-center"
          >
            {slides[currentSlide].illustration}
            
            <h2 className="text-3xl font-black tracking-tight mb-3 mt-4 uppercase font-sans" style={{ fontFamily: 'Impact, sans-serif', letterSpacing: '1px' }}>
              {slides[currentSlide].title}
            </h2>
            <p className="text-xs text-white/60 font-bold tracking-widest uppercase">
              {slides[currentSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Login Buttons */}
      <div className="w-full px-6 pb-10 z-50 max-w-md mx-auto">
        <button 
          onClick={onLogin}
          className="w-full py-4 rounded-2xl bg-[#222] border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#333] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          CONTINUE WITH GOOGLE
        </button>
        
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs font-bold text-white/40 uppercase">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        
        <button 
          onClick={onLogin}
          className="w-full py-4 rounded-2xl bg-[#222] border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#333] transition-colors"
        >
          <Phone className="w-5 h-5 text-[#bde85b]" />
          CONTINUE WITH PHONE NUMBER
        </button>
      </div>
    </div>
  );
};
