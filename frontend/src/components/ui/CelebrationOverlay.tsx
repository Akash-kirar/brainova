import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Shield, Diamond, Zap, X } from 'lucide-react';

interface CelebrationOverlayProps {
  score: number;
  coins: number;
  streak?: number;
  onClose: () => void;
}

export default function CelebrationOverlay({ score, coins, streak = 1, onClose }: CelebrationOverlayProps) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // Auto-open after a short delay
    const timer = setTimeout(() => {
      setOpened(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0a0c]/90 backdrop-blur-sm">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-blue-500 rounded-full blur-[1px] opacity-70" />
        <div className="absolute top-[30%] right-[25%] w-2 h-2 bg-green-500 rounded-full blur-[1px] opacity-70" />
        <div className="absolute bottom-[40%] left-[25%] w-2 h-2 bg-purple-500 rounded-full blur-[1px] opacity-70" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm flex flex-col items-center text-center relative z-10"
      >
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon Header */}
        <div className="relative mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            className="w-28 h-28 bg-[#5b5fff] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(91,95,255,0.4)] relative z-10"
          >
            <Bot className="w-16 h-16 text-white" strokeWidth={2} />
          </motion.div>
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="relative">
              <Shield className="w-10 h-10 text-[#10b981] fill-[#0a0a0c]" strokeWidth={2.5} />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-sm">1</span>
              {/* Motion lines around shield */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 -rotate-12">
                <div className="w-2 h-0.5 bg-[#10b981] rounded-full" />
                <div className="w-3 h-0.5 bg-[#10b981] rounded-full" />
              </div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-end rotate-12">
                <div className="w-2 h-0.5 bg-[#10b981] rounded-full" />
                <div className="w-3 h-0.5 bg-[#10b981] rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white mb-8"
        >
          Rewards Unlocked
        </motion.h2>

        {/* Rewards Grid */}
        <div className={`grid grid-cols-${streak > 0 ? 3 : 2} gap-3 w-full mb-8`}>
          {/* XP Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#121217] border border-white/5 rounded-2xl p-4 flex flex-col items-center"
          >
            <div className="w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <span className="text-white font-bold text-xs uppercase tracking-wider">XP</span>
            </div>
            <span className="text-white font-bold text-lg leading-none mb-1">+{score}</span>
            <span className="text-white/40 text-xs font-medium">XP</span>
          </motion.div>

          {/* Gems Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#121217] border border-white/5 rounded-2xl p-4 flex flex-col items-center"
          >
            <div className="w-10 h-10 flex items-center justify-center mb-3">
              <Diamond className="w-7 h-7 text-[#c084fc] drop-shadow-[0_0_10px_rgba(192,132,252,0.4)]" />
            </div>
            <span className="text-white font-bold text-lg leading-none mb-1">+{coins}</span>
            <span className="text-white/40 text-xs font-medium">Gems</span>
          </motion.div>

          {/* Streak Card */}
          {streak > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-[#121217] border border-white/5 rounded-2xl p-4 flex flex-col items-center"
            >
              <div className="w-10 h-10 flex items-center justify-center mb-3">
                <Zap className="w-7 h-7 text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              </div>
              <span className="text-white font-bold text-lg leading-none mb-1">+{streak}</span>
              <span className="text-white/40 text-xs font-medium">Streak Slot</span>
            </motion.div>
          )}
        </div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onClose}
          className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-lg py-4 rounded-xl transition-all active:scale-95"
        >
          Continue Your Journey
        </motion.button>
      </motion.div>
    </div>
  );
}
