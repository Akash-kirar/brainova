import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Lightbulb, Play, RotateCcw, Trophy } from 'lucide-react';

type GameState = 'menu' | 'red' | 'yellow' | 'green' | 'early' | 'result' | 'gameover';

interface ReactionLightGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, reactionTime: number) => void;
}

export default function ReactionLightGame({ onBack, onGameComplete, difficulty = 'easy' }: ReactionLightGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [attempts, setAttempts] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentReaction, setCurrentReaction] = useState<number>(0);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    setAttempts(0);
    setReactionTimes([]);
    startRound();
  };

  const startRound = () => {
    setGameState('red');
    
    timeoutRef.current = setTimeout(() => {
      setGameState('yellow');
      
      const waitTime = Math.floor(Math.random() * 2000) + 1000;
      timeoutRef.current = setTimeout(() => {
        setGameState('green');
        startTimeRef.current = Date.now();
      }, waitTime);
      
    }, 1500);
  };

  const handleTap = () => {
    if (gameState === 'red' || gameState === 'yellow') {
      // Tapped too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
    } else if (gameState === 'green') {
      // Good tap
      const reaction = Date.now() - startTimeRef.current;
      setCurrentReaction(reaction);
      
      const newTimes = [...reactionTimes, reaction];
      setReactionTimes(newTimes);
      setAttempts(a => a + 1);
      
      if (newTimes.length >= 5) {
        setGameState('gameover');
        if (onGameComplete) {
          const avg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
          const score = Math.max(0, Math.floor((1000 - avg) * 5));
          onGameComplete(score, avg);
        }
      } else {
        setGameState('result');
      }
    }
  };

  const nextRound = () => {
    startRound();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-lg">Reaction Light</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full z-10">
              <div className="w-24 h-24 rounded-3xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-8">
                <Lightbulb className="w-12 h-12 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Reaction Light</h2>
              <p className="text-white/60 mb-12">Wait for the green light, then tap as fast as you can! Best of 5 rounds.</p>
              <button onClick={startGame} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {(gameState === 'red' || gameState === 'yellow' || gameState === 'green') && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
              onPointerDown={handleTap}
            >
              <div className="bg-[#1a1a1c] p-8 rounded-[3rem] border-4 border-white/10 flex flex-col gap-6 shadow-2xl">
                <div className={`w-32 h-32 rounded-full transition-all duration-200 ${gameState === 'red' ? 'bg-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.6)]' : 'bg-rose-500/20'}`} />
                <div className={`w-32 h-32 rounded-full transition-all duration-200 ${gameState === 'yellow' ? 'bg-amber-500 shadow-[0_0_40px_rgba(251,191,36,0.6)]' : 'bg-amber-500/20'}`} />
                <div className={`w-32 h-32 rounded-full transition-all duration-200 ${gameState === 'green' ? 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.6)]' : 'bg-emerald-500/20'}`} />
              </div>
              
              <div className="mt-12 text-white/60 text-xl font-bold">
                Round {attempts + 1} of 5
              </div>
            </motion.div>
          )}

          {gameState === 'early' && (
            <motion.div key="early" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-10">
              <h2 className="text-4xl font-bold text-rose-400 mb-4">Too Early!</h2>
              <p className="text-white/60 mb-8">Wait for the green light before tapping.</p>
              <button onClick={nextRound} className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl transition-colors">
                Try Again
              </button>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-10">
              <h2 className="text-5xl font-bold text-emerald-400 mb-2">{currentReaction} ms</h2>
              <p className="text-white/60 mb-8">Round {attempts} of 5</p>
              <button onClick={nextRound} className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl transition-colors">
                Next Round
              </button>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full z-10">
              <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
              <p className="text-white/60 mb-8">Your average reaction time:</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5">
                <span className="text-5xl font-bold text-cyan-400">
                  {Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)} ms
                </span>
              </div>
              <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
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
