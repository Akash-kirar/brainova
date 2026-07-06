import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Star, Globe, Play } from 'lucide-react';

interface GameMenuProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  onStart: (difficulty: 'easy' | 'medium' | 'hard') => void;
  showDifficulty?: boolean;
  onBack?: () => void;
}

export default function GameMenu({
  title,
  description,
  icon,
  iconBgColor = 'bg-rose-500/10',
  iconColor = 'text-rose-400',
  onStart,
  showDifficulty = true,
  onBack,
}: GameMenuProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isStarred, setIsStarred] = useState(false);

  return (
    <motion.div
      key="menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-[#0a0a0c] flex flex-col font-sans"
    >
      {/* Header */}
      <div className="flex items-center px-6 py-5 shrink-0 relative">
        <button onClick={onBack} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors absolute left-6">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-[18px] font-bold text-white text-center flex-1">Game Details</h2>
        <button 
          onClick={() => setIsStarred(!isStarred)}
          className="absolute right-6 p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Star className={`w-6 h-6 ${isStarred ? 'fill-white text-white' : 'text-white/70'}`} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 overflow-y-auto pb-8">
        
        {/* Main Icon with Concentric Rings */}
        <div className="flex justify-center mt-6 mb-8 relative">
          <div className="w-48 h-48 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-[20px] border-white/[0.02]" />
            <div className="absolute inset-4 rounded-full border-[15px] border-rose-500/10" />
            <div className="absolute inset-[30px] rounded-full border-[2px] border-rose-500/30 bg-rose-500/5 shadow-[0_0_30px_rgba(244,63,94,0.15)]" />
            <div className="relative z-10 scale-[2] text-rose-500">
              {icon}
            </div>
          </div>
        </div>

        {/* Title and Category */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-[28px] font-bold text-white mb-2 tracking-tight text-center">{title}</h2>
          <p className="text-[#a1a1aa] text-[16px]">Memory</p>
        </div>

        {/* Level Tag */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-1.5 bg-[#064e3b]/30 border border-[#047857]/50 rounded-full flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#34d399]" />
            <span className="text-[#34d399] text-[14px] font-medium tracking-wide">Level 4 • Easy</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#a1a1aa] text-center text-[15px] max-w-[320px] mx-auto mb-8 leading-relaxed">
          {description}
        </p>

        {/* Stats */}
        <div className="w-full bg-[#18181b] border border-white/5 rounded-2xl p-5 flex justify-between divide-x divide-white/5 mb-8">
          <div className="flex flex-col items-center flex-1">
            <span className="text-[#a1a1aa] text-[13px] mb-1 font-medium">Best Score</span>
            <span className="text-white font-bold text-[22px]">1250</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[#a1a1aa] text-[13px] mb-1 font-medium">Avg. Score</span>
            <span className="text-white font-bold text-[22px]">980</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[#a1a1aa] text-[13px] mb-1 font-medium">Accuracy</span>
            <span className="text-white font-bold text-[22px]">92%</span>
          </div>
        </div>

        {/* Difficulty Selection */}
        {showDifficulty && (
          <div className="w-full mb-8">
            <h3 className="text-white font-bold text-[18px] mb-4">Select Difficulty</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as const).map((diff) => {
                const isSelected = difficulty === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-4 rounded-[16px] font-medium text-[16px] capitalize transition-all ${
                      isSelected 
                        ? 'bg-[#064e3b]/30 border border-[#10b981] text-[#34d399]' 
                        : 'bg-[#18181b] border border-white/5 text-white/70 hover:bg-[#27272a]'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Action Bar */}
      <div className="p-6 shrink-0 flex items-center gap-4 bg-[#0a0a0c]">
        <button 
          onClick={() => onStart(showDifficulty ? difficulty : 'medium')}
          className="flex-1 bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#8b5cf6] text-white font-bold py-5 rounded-2xl text-[18px] shadow-[0_4px_24px_rgba(99,102,241,0.3)] active:scale-[0.98] transition-transform"
        >
          Play Now
        </button>
        <button 
          onClick={() => setIsStarred(!isStarred)}
          className="w-[66px] h-[66px] shrink-0 bg-[#18181b] rounded-2xl border border-white/5 flex items-center justify-center active:scale-[0.98] transition-transform"
        >
          <Star className={`w-7 h-7 ${isStarred ? 'fill-white text-white' : 'text-white/70'}`} />
        </button>
      </div>
    </motion.div>
  );
}
