import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, Zap, TrendingUp, Gamepad2, Target, Flame, Users, BarChart2, ChevronRight, Sparkles } from 'lucide-react';

interface OnboardingScreensProps {
  onLogin: () => void;
}

export const OnboardingScreens: React.FC<OnboardingScreensProps> = ({ onLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onLogin();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const FeatureCard = ({ icon, colorClass, shadowClass, title, titleColor, desc }: any) => (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center gap-4 text-left">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass} ${shadowClass}`}>
         {icon}
      </div>
      <div className="flex-1">
        <h3 className={`text-lg font-bold ${titleColor} mb-1`}>{title}</h3>
        <p className="text-sm text-gray-400 leading-tight">{desc}</p>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon }: any) => (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center">
      <span className="text-[10px] text-gray-400">{title}</span>
      <span className="text-xl font-bold">{value}</span>
      {icon}
    </div>
  );

  const InfoCard = ({ icon, title, titleColor, desc }: any) => (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center h-full">
      <div className="mb-3">{icon}</div>
      <span className={`text-[10px] font-bold ${titleColor} leading-tight mb-1 uppercase`}>{title}</span>
      <span className="text-[9px] text-gray-400 leading-tight">{desc}</span>
    </div>
  );


  const Star = () => <svg className="w-4 h-4 text-white fill-current opacity-80" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
  
  const CrownSVG = ({ className, color }: any) => (
    <svg className={className} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );

  const slides = [
    {
      buttonText: "Let's Get Started",
      content: (
        <div className="flex flex-col items-center w-full text-center">
          <h2 className="text-3xl font-black tracking-tight mb-8">
            WHY <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">BRAINOVA?</span>
          </h2>
          <div className="flex flex-col gap-4 w-full">
            <FeatureCard 
              icon={<Brain className="text-purple-500 w-7 h-7" />} 
              colorClass="bg-purple-500/10"
              shadowClass="shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              titleColor="text-purple-400"
              title="Train Your Brain" 
              desc="Improve memory, focus, logic and problem solving." 
            />
            <FeatureCard 
              icon={<TrendingUp className="text-green-400 w-7 h-7" />} 
              colorClass="bg-green-500/10"
              shadowClass="shadow-[0_0_20px_rgba(74,222,128,0.3)]"
              titleColor="text-green-400"
              title="Track Your Progress" 
              desc="Detailed stats and insights to measure your growth." 
            />
            <FeatureCard 
              icon={<Zap className="text-orange-400 w-7 h-7 fill-current" />} 
              colorClass="bg-orange-500/10"
              shadowClass="shadow-[0_0_20px_rgba(251,146,60,0.3)]"
              titleColor="text-orange-400"
              title="Daily Challenges" 
              desc="Build streaks, complete goals and stay consistent." 
            />
            <FeatureCard 
              icon={<Trophy className="text-blue-400 w-7 h-7" />} 
              colorClass="bg-blue-500/10"
              shadowClass="shadow-[0_0_20px_rgba(96,165,250,0.3)]"
              titleColor="text-blue-400"
              title="Compete & Climb" 
              desc="Climb leaderboards and become the best." 
            />
          </div>
        </div>
      )
    },
    {
      buttonText: "Start My Journey",
      buttonIcon: <Trophy className="w-5 h-5 mr-2" />,
      content: (
        <div className="flex flex-col items-center w-full text-center">
          <h2 className="text-[26px] leading-tight font-black tracking-tight mb-2 uppercase">
            TRACK. <span className="text-purple-400">IMPROVE.</span> <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">BEAT YOUR BEST</span>
          </h2>
          <p className="text-sm text-gray-400 mb-6">Detailed stats to help you grow every day.</p>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden h-48">
              <div className="relative w-32 h-32 flex flex-col items-center justify-center">
                 <svg className="absolute inset-0 w-full h-full transform -rotate-90 overflow-visible">
                   <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                   <circle cx="64" cy="64" r="56" stroke="url(#gradient)" strokeWidth="8" fill="none" strokeDasharray="350" strokeDashoffset="50" className="drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" strokeLinecap="round" />
                   <defs>
                     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" stopColor="#a855f7" />
                       <stop offset="100%" stopColor="#38bdf8" />
                     </linearGradient>
                   </defs>
                 </svg>
                 <span className="text-xs text-gray-400 mt-1 mb-1">Brain Score</span>
                 <span className="text-4xl font-black">842</span>
                 <span className="text-sm text-cyan-400 font-bold mt-1">Great</span>
              </div>
            </div>
            
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 flex flex-col justify-center items-start h-48">
              <span className="text-sm text-gray-400 mb-3">This Week</span>
              <div className="flex items-center gap-3">
                 <span className="text-[40px] font-black text-green-400 leading-none">+62</span>
                 <TrendingUp className="text-green-400 w-8 h-8 flex-shrink-0" />
              </div>
              <span className="text-xs text-gray-500 mt-4">vs last week</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 w-full">
             <StatCard title="Games Played" value="24" icon={<Gamepad2 className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />} />
             <StatCard title="Win Rate" value="78%" icon={<Target className="w-8 h-8 text-pink-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]" />} />
             <StatCard title="Streak" value="7 Days" icon={<Flame className="w-8 h-8 text-orange-400 fill-current drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]" />} />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0f] font-sans text-white relative overflow-hidden">
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 right-0 flex gap-1.5 p-3 z-50">
        {[0, 1].map((i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div 
              className="h-full bg-green-400"
              initial={{ width: i < currentSlide ? '100%' : '0%' }}
              animate={{ width: i <= currentSlide ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-6 flex items-center gap-3 z-50">
        <div className="w-8 h-8 rounded-full border border-green-400/30 flex items-center justify-center bg-green-400/10 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
          <Brain className="w-4 h-4 text-green-400" />
        </div>
        <span className="text-xs font-bold tracking-widest text-green-400 uppercase">Welcome to Brainova</span>
      </div>

      {/* Main Content Carousel */}
      <div className="flex-1 relative flex flex-col items-center pt-24 px-6 overflow-y-auto pb-24 no-scrollbar">
        {/* Clickable areas for navigation - only active when not clicking buttons */}
        <div 
          className="absolute top-20 left-0 bottom-24 w-1/4 z-40 cursor-pointer" 
          onClick={handlePrev}
        />
        <div 
          className="absolute top-20 right-0 bottom-24 w-1/4 z-40 cursor-pointer" 
          onClick={handleNext}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-md mx-auto flex flex-col items-center relative z-50 pointer-events-none"
          >
             <div className="pointer-events-auto w-full">
               {slides[currentSlide].content}
             </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Login Button / Pagination */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-50 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pt-10">
        <div className="w-full max-w-md mx-auto">
          {/* Bottom Dots */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex justify-center gap-2">
              {[0, 1].map((i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-purple-500' : 'w-1.5 bg-white/20'}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="text-white/60 font-medium hover:text-white transition-colors flex items-center"
            >
              {currentSlide === 1 ? 'Start' : 'Next'} <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
