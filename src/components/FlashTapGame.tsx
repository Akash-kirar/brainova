import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FlashTapGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, reactionTime: number) => void;
}

export default function FlashTapGame({ onBack, onGameComplete }: FlashTapGameProps) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const lastFlashTime = useRef<number>(0);
  const gridSize = 9; // 3x3 grid

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  useEffect(() => {
    let flashTimer: NodeJS.Timeout;
    if (gameState === 'playing') {
      const flashInterval = Math.max(400, 1200 - score * 40);
      flashTimer = setInterval(flashRandomBox, flashInterval);
    }
    return () => clearInterval(flashTimer);
  }, [gameState, score]);

  const flashRandomBox = () => {
    let nextBox;
    do {
      nextBox = Math.floor(Math.random() * gridSize);
    } while (nextBox === activeBox);
    
    setActiveBox(nextBox);
    lastFlashTime.current = Date.now();
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setReactionTimes([]);
    setGameState('playing');
    flashRandomBox();
  };

  const endGame = () => {
    setGameState('gameover');
    setActiveBox(null);
    if (onGameComplete) {
      const avgReaction = reactionTimes.length > 0 
        ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length 
        : 1000;
      onGameComplete(score * 150, avgReaction);
    }
  };

  const handleBoxTap = (index: number) => {
    if (gameState !== 'playing') return;
    
    if (index === activeBox) {
      const reactionTime = Date.now() - lastFlashTime.current;
      setReactionTimes(prev => [...prev, reactionTime]);
      setScore(prev => prev + 1);
      setActiveBox(null); // Hide until next flash
    } else {
      // Penalty for wrong tap
      setScore(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="p-4 flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl font-bold">Flash Tap</h1>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState === 'start' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full"
          >
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Flash Tap</h2>
            <p className="text-slate-400 mb-8">
              Tap the flashing boxes as quickly as possible. Don't tap the wrong ones!
            </p>
            <button
              onClick={startGame}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" />
              Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-md flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Score</p>
                <p className="text-2xl font-bold text-amber-400">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Time</p>
                <p className="text-2xl font-bold text-white">{timeLeft}s</p>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 w-full aspect-square max-w-[400px]">
                {Array.from({ length: gridSize }).map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleBoxTap(index)}
                    className={`rounded-2xl border-2 transition-all duration-100 ${
                      activeBox === index
                        ? 'bg-amber-400 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full"
          >
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
            <p className="text-slate-400 mb-6">You tapped {score} flashing boxes</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">Final Score</p>
                <p className="text-2xl font-bold text-amber-400">{score * 150}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">Avg Reaction</p>
                <p className="text-2xl font-bold text-blue-400">
                  {reactionTimes.length > 0 
                    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) 
                    : 0}ms
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors"
              >
                Menu
              </button>
              <button
                onClick={startGame}
                className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
