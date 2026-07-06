import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Trophy, Gift, Coins, X } from 'lucide-react';

interface CelebrationOverlayProps {
  score: number;
  coins: number;
  onClose: () => void;
}

export default function CelebrationOverlay({ score, coins, onClose }: CelebrationOverlayProps) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // Auto-open after a short delay
    const timer = setTimeout(() => {
      setOpened(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-gradient-to-b from-[#1a1a24] to-[#121217] border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center text-center shadow-[0_0_50px_rgba(250,204,21,0.15)]"
      >
        {/* Confetti effect background layer */}
        <AnimatePresence>
          {opened && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 200, x: 0, opacity: 1, scale: 0 }}
                  animate={{ 
                    y: -100 - Math.random() * 200,
                    x: (Math.random() - 0.5) * 300,
                    opacity: [0, 1, 1, 0],
                    scale: Math.random() * 1 + 0.5,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 1.5 + Math.random() * 1, ease: "easeOut", delay: Math.random() * 0.2 }}
                  className="absolute bottom-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#facc15', '#38bdf8', '#f472b6', '#4ade80'][Math.floor(Math.random() * 4)],
                    marginLeft: -6,
                    marginBottom: -6
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 relative"
        >
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.button
                key="closed"
                exit={{ scale: 0, rotate: -10, opacity: 0 }}
                onClick={() => setOpened(true)}
                className="relative group cursor-pointer"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 5, -5, 5, 0],
                    scale: [1, 1.05, 1.05, 1.05, 1.05, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                >
                  <Gift className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]" strokeWidth={1.5} />
                </motion.div>
                <p className="mt-4 text-yellow-400/80 font-bold uppercase tracking-widest text-sm animate-pulse">Tap to Open</p>
              </motion.button>
            ) : (
              <motion.div
                key="opened"
                initial={{ scale: 0, rotate: 10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                className="relative flex justify-center items-center h-32"
              >
                <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full" />
                <motion.div 
                  initial={{ y: 20 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="relative flex items-center justify-center"
                >
                  <Coins className="w-24 h-24 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] fill-yellow-400" strokeWidth={1} />
                  <span className="absolute text-yellow-900 font-black text-2xl -mt-2">+{coins}</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <h2 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent pb-1">
                Outstanding!
              </h2>
              <p className="text-[#a1a1aa] text-[15px] mb-8 font-medium">
                You've earned <strong className="text-yellow-400">{coins} Nova Coins</strong> for your high score of <strong className="text-white">{score}</strong>!
              </p>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all active:scale-95"
              >
                Claim Reward
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
