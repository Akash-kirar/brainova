import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Target, Zap } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface FocusTapGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

export default function FocusTapGame({ onBack, onGameComplete }: FocusTapGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; isTarget: boolean }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnTargets = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Number of targets increases with level
    const targetCount = Math.min(3 + Math.floor(level / 2), 10);
    const newTargets = [];
    
    // Ensure at least one is the true target
    const trueTargetIndex = Math.floor(Math.random() * targetCount);
    
    for (let i = 0; i < targetCount; i++) {
      // Keep away from edges
      const padding = 60;
      const x = padding + Math.random() * (width - padding * 2);
      const y = padding + Math.random() * (height - padding * 2);
      
      newTargets.push({
        id: Date.now() + i,
        x,
        y,
        isTarget: i === trueTargetIndex
      });
    }
    
    setTargets(newTargets);
  }, [level]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setLevel(1);
    setCombo(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      spawnTargets();
    }
  }, [gameState, level, spawnTargets]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(score, level);
    }
  }, [gameState, timeLeft, score, level, onGameComplete]);

  const handleTargetClick = (isTarget: boolean) => {
    if (gameState !== 'playing') return;

    if (isTarget) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(s => s + 10 * Math.min(newCombo, 5));
      
      if (newCombo % 5 === 0) {
        setLevel(l => l + 1);
        setTimeLeft(t => t + 2); // Bonus time
      } else {
        spawnTargets();
      }
    } else {
      setCombo(0);
      setScore(s => Math.max(0, s - 20));
      setTimeLeft(t => Math.max(0, t - 2)); // Penalty
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-lg">Focus Tap</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                <Target className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Focus Tap</h2>
              <p className="text-white/60 mb-12 max-w-xs mx-auto">Tap the <span className="text-emerald-400 font-bold">Green</span> target. Avoid the red ones. Be quick!</p>
              <button onClick={startGame} className="w-full max-w-sm bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <div className="flex justify-between items-center px-6 py-4 bg-[#1a1a1c] border-b border-white/5">
                <div className="flex flex-col">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Time</span>
                  <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Combo</span>
                  <span className="text-2xl font-bold text-emerald-400">x{combo}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Score</span>
                  <span className="text-2xl font-bold">{score}</span>
                </div>
              </div>

              <div ref={containerRef} className="flex-1 relative overflow-hidden">
                {targets.map((target) => (
                  <motion.button
                    key={target.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTargetClick(target.isTarget)}
                    className={`absolute w-16 h-16 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 shadow-lg ${
                      target.isTarget 
                        ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                        : 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                    }`}
                    style={{ left: target.x, top: target.y }}
                  >
                    <Target className={`w-8 h-8 ${target.isTarget ? 'text-emerald-100' : 'text-rose-100'}`} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
              <p className="text-white/60 mb-8">You reached Level {level}</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5 w-full max-w-sm">
                <span className="text-white/50 text-sm font-bold uppercase tracking-wider block mb-2">Final Score</span>
                <span className="text-5xl font-bold text-emerald-400">{score}</span>
              </div>
              <div className="flex gap-4 w-full max-w-sm">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
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
