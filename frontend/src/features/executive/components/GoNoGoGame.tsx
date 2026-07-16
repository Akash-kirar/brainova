import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Zap, Target } from 'lucide-react';

interface GoNoGoGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function GoNoGoGame({ onBack, onGameComplete, difficulty }: GoNoGoGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [isGo, setIsGo] = useState(true);
  const [showItem, setShowItem] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    let interval: NodeJS.Timeout;
    
    const scheduleNext = () => {
      setShowItem(false);
      
      const delay = Math.random() * 1000 + 500;
      interval = setTimeout(() => {
        const goProbability = 0.7; // 70% go, 30% no-go
        setIsGo(Math.random() < goProbability);
        setShowItem(true);
        
        // Auto hide after some time if they don't tap
        const hideDelay = Math.max(500, 1500 - level * 50);
        setTimeout(() => {
          if (gameState === 'playing') {
            setShowItem(false);
            scheduleNext();
          }
        }, hideDelay);
        
      }, delay);
    };
    
    scheduleNext();
    
    return () => {
      clearTimeout(interval);
    };
  }, [level, gameState]);

  const handleTap = () => {
    if (gameState !== 'playing' || !showItem) return;
    
    setShowItem(false);
    
    if (isGo) {
      setScore(s => s + 15);
      setLevel(l => Math.floor(score / 50) + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 10)); // Big penalty for tapping no-go
    }
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
  };

  return (
    <div 
      className="flex flex-col h-full bg-[#0a0a0c] text-white cursor-pointer select-none"
      onClick={handleTap}
    >
      <div className="flex items-center justify-between p-6 pointer-events-none">
        <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors pointer-events-auto">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-lg">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-lg">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pointer-events-none">
        {gameState === 'playing' ? (
          <div className="flex flex-col items-center">
            <h2 className="text-xl text-white/50 mb-12 uppercase tracking-widest font-bold">
              Tap GREEN. Do NOT tap RED.
            </h2>
            
            <div className="h-64 flex items-center justify-center">
              <AnimatePresence>
                {showItem && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.3 }}
                  >
                    <Target className={`w-48 h-48 ${isGo ? 'text-green-500' : 'text-red-500'}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="text-center pointer-events-auto">
            <h2 className="text-3xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-8">Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
