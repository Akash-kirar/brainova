import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Zap, Play, RotateCcw, Trophy } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface FastButtonGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

export default function FastButtonGame({ onBack, onGameComplete, difficulty = 'easy' }: FastButtonGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  
  const startGame = () => {
    setTaps(0);
    setTimeLeft(10);
    setGameState('playing');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(taps, 1);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, taps, onGameComplete]);

  const handleTap = () => {
    if (gameState === 'playing') {
      setTaps(t => t + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-lg">Fast Button</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full z-10">
              <div className="w-24 h-24 rounded-3xl bg-amber-500/20 flex items-center justify-center mx-auto mb-8">
                <Zap className="w-12 h-12 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Fast Button</h2>
              <p className="text-white/60 mb-12">Tap the button as many times as you can in 10 seconds!</p>
              <button onClick={startGame} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md flex flex-col items-center">
              <div className="flex justify-between w-full mb-12 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Time</span>
                  <span className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Taps</span>
                  <span className="text-3xl font-bold">{taps}</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleTap}
                className="w-64 h-64 rounded-full bg-amber-500 hover:bg-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.3)] flex items-center justify-center text-white font-black text-6xl select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                TAP!
              </motion.button>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full z-10">
              <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
              <p className="text-white/60 mb-8">Your tap speed:</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5">
                <span className="text-5xl font-bold text-amber-400">{taps}</span>
                <span className="text-white/50 text-sm block mt-2">taps in 10s</span>
                <span className="text-white/80 text-lg font-bold block mt-4">{taps / 10} taps/sec</span>
              </div>
              <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                  <RotateCcw className="w-5 h-5" /> Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
