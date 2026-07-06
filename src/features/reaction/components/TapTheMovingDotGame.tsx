import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface TapTheMovingDotGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, reactionTime: number) => void;
}

export default function TapTheMovingDotGame({ onBack, onGameComplete, difficulty = 'easy' }: TapTheMovingDotGameProps) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [dotPosition, setDotPosition] = useState({ x: 50, y: 50 });
  const [dotSize, setDotSize] = useState(60);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const lastDotTime = useRef<number>(0);

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
    let moveTimer: NodeJS.Timeout;
    if (gameState === 'playing') {
      const moveInterval = Math.max(500, 1500 - score * 50); // Gets faster as score increases
      moveTimer = setInterval(moveDot, moveInterval);
    }
    return () => clearInterval(moveTimer);
  }, [gameState, score]);

  const moveDot = () => {
    setDotPosition({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80
    });
    setDotSize(Math.max(30, 60 - score * 1.5)); // Gets smaller as score increases
    lastDotTime.current = Date.now();
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setReactionTimes([]);
    setGameState('playing');
    moveDot();
  };

  const endGame = () => {
    setGameState('gameover');
    if (onGameComplete) {
      const avgReaction = reactionTimes.length > 0 
        ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length 
        : 1000;
      onGameComplete(score * 100, avgReaction);
    }
  };

  const handleDotTap = () => {
    if (gameState !== 'playing') return;
    
    const reactionTime = Date.now() - lastDotTime.current;
    setReactionTimes(prev => [...prev, reactionTime]);
    setScore(prev => prev + 1);
    moveDot();
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
          <Target className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-bold">Tap the Moving Dot</h1>
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
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Tap the Moving Dot</h2>
            <p className="text-slate-400 mb-8">
              Tap the dot as quickly as possible. It gets smaller and moves faster as you score!
            </p>
            <button
              onClick={startGame}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" />
              Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-2xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Score</p>
                <p className="text-2xl font-bold text-emerald-400">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Time</p>
                <p className="text-2xl font-bold text-white">{timeLeft}s</p>
              </div>
            </div>

            <div className="flex-1 bg-slate-800/30 rounded-2xl border border-slate-700/50 relative overflow-hidden">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleDotTap}
                className="absolute rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                style={{
                  left: `${dotPosition.x}%`,
                  top: `${dotPosition.y}%`,
                  width: dotSize,
                  height: dotSize,
                  transform: 'translate(-50%, -50%)'
                }}
                whileTap={{ scale: 0.9 }}
              />
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full"
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
            <p className="text-slate-400 mb-6">You tapped {score} dots</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">Final Score</p>
                <p className="text-2xl font-bold text-emerald-400">{score * 100}</p>
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
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
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
