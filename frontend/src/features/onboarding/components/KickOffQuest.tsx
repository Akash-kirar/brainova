import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Sliders } from 'lucide-react';

interface KickOffQuestProps {
  onBack: () => void;
}

export const KickOffQuest: React.FC<KickOffQuestProps> = ({ onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#0a0a0c] z-[99999] overflow-y-auto pb-24"
    >
      {/* Header Nav */}
      <div className="sticky top-0 z-50 bg-[#0a0a0c]/90 backdrop-blur-md px-6 py-4 flex items-center pt-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors -ml-2"
        >
          <ChevronLeft className="w-7 h-7 text-white" />
        </button>
      </div>

      <div className="px-6 relative z-10 w-full mb-8">
        <div className="bg-[#1a1a1c] rounded-[16px] p-5 border border-white/5 mt-2">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[#bde85b] text-[13px] font-bold uppercase tracking-wide">Complete Tasks To Earn Rewards</span>
            <span className="text-white/50 text-[13px] font-bold"><span className="text-[#bde85b]">0</span> / 3</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex gap-1.5 h-1.5 overflow-hidden">
            <div className="h-full bg-white/10 w-1/3 rounded-full relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#bde85b]"></div>
            </div>
            <div className="h-full bg-white/10 w-1/3 rounded-full"></div>
            <div className="h-full bg-white/10 w-1/3 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Decorative jagged line separator */}
      <div className="w-full relative h-16 overflow-hidden -mt-4 mb-2">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full absolute top-0 text-[#bde85b]">
          <path 
            d="M0 10 L8 8 L15 15 L25 10 L35 15 L45 8 L55 12 L65 8 L75 14 L85 10 L95 12 L100 10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="px-6 space-y-4 relative z-10">
        {/* Task 1: Mind Snap Duel */}
        <div className="bg-[#1a1a1c] rounded-[20px] p-5 flex items-center justify-between group cursor-pointer hover:bg-[#222] transition-colors border border-white/5">
          <div className="flex items-center gap-5 flex-1">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <div className="relative w-[30px] h-[30px]">
                <div className="absolute right-0 bottom-0 w-[20px] h-[20px] rounded-[6px] bg-[#3b82f6]"></div>
                <div className="absolute left-0 top-0 w-[20px] h-[20px] rounded-[6px] border-[4px] border-[#3b82f6] bg-[#1a1a1c] group-hover:bg-[#222] transition-colors"></div>
              </div>
            </div>
            
            <div className="flex-1 pr-6 flex flex-col justify-center mt-1">
              <h3 className="text-[17px] font-bold text-white mb-2.5 tracking-tight leading-none">Mind Snap Duel</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[3px] bg-[#333] rounded-full relative">
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#3b82f6]"></div>
                </div>
                <span className="text-[13px] font-bold text-white/40 leading-none"><span className="text-[#3b82f6]">0</span> / 1</span>
              </div>
            </div>
          </div>
          
          <button className="px-5 py-2 rounded-full bg-[#111] border-[1.5px] border-[#3b82f6] shadow-[2px_3px_0_0_#3b82f6] hover:translate-y-[2px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_0_#3b82f6] transition-all active:shadow-none active:translate-y-[3px] active:translate-x-[2px] text-white font-bold text-sm shrink-0 w-[72px]">
            Play
          </button>
        </div>

        {/* Task 2: Mini-Sudoku */}
        <div className="bg-[#1a1a1c] rounded-[20px] p-5 flex items-center justify-between group cursor-pointer hover:bg-[#222] transition-colors border border-white/5">
          <div className="flex items-center gap-5 flex-1">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <div className="grid grid-cols-2 gap-1.5 w-[28px] h-[28px]">
                <div className="border-[3px] border-[#10b981] rounded-[6px]"></div>
                <div className="border-[3px] border-[#10b981] rounded-[6px]"></div>
                <div className="border-[3px] border-[#10b981] rounded-[6px]"></div>
                <div className="border-[3px] border-[#10b981] rounded-[6px]"></div>
              </div>
            </div>
            
            <div className="flex-1 pr-6 flex flex-col justify-center mt-1">
              <h3 className="text-[17px] font-bold text-white mb-2.5 tracking-tight leading-none">Mini-Sudoku's Daily Challenge</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[3px] bg-[#333] rounded-full relative">
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#10b981]"></div>
                </div>
                <span className="text-[13px] font-bold text-white/40 leading-none"><span className="text-[#10b981]">0</span> / 1</span>
              </div>
            </div>
          </div>
          
          <button className="px-5 py-2 rounded-full bg-[#111] border-[1.5px] border-[#10b981] shadow-[2px_3px_0_0_#10b981] hover:translate-y-[2px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_0_#10b981] transition-all active:shadow-none active:translate-y-[3px] active:translate-x-[2px] text-white font-bold text-sm shrink-0 w-[72px]">
            Play
          </button>
        </div>

        {/* Task 3: Math's Daily Challenge */}
        <div className="bg-[#1a1a1c] rounded-[20px] p-5 flex items-center justify-between group cursor-pointer hover:bg-[#222] transition-colors border border-white/5">
          <div className="flex items-center gap-5 flex-1">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <div className="w-[30px] h-[30px] border-[3px] border-[#eab308] rounded-[8px] flex items-center justify-center">
                <Sliders className="w-4 h-4 text-[#eab308]" strokeWidth={3} />
              </div>
            </div>
            
            <div className="flex-1 pr-6 flex flex-col justify-center mt-1">
              <h3 className="text-[17px] font-bold text-white mb-2.5 tracking-tight leading-none">Math's Daily Challenge</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[3px] bg-[#333] rounded-full relative">
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#eab308]"></div>
                </div>
                <span className="text-[13px] font-bold text-white/40 leading-none"><span className="text-[#eab308]">0</span> / 1</span>
              </div>
            </div>
          </div>
          
          <button className="px-5 py-2 rounded-full bg-[#111] border-[1.5px] border-[#eab308] shadow-[2px_3px_0_0_#eab308] hover:translate-y-[2px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_0_#eab308] transition-all active:shadow-none active:translate-y-[3px] active:translate-x-[2px] text-white font-bold text-sm shrink-0 w-[72px]">
            Play
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default KickOffQuest;
