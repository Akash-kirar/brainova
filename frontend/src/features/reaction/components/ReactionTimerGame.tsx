import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface ReactionTimerGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, reactionTime: number) => void;
}

export default function ReactionTimerGame({ onBack, onGameComplete, difficulty = 'easy' }: ReactionTimerGameProps) {
  const [gameState, setGameState] = useState<'start' | 'waiting' | 'ready' | 'result' | 'gameover'>('start');
  const [message, setMessage] = useState('Wait for Green');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentReaction, setCurrentReaction] = useState<number>(0);
  const [round, setRound] = useState(1);
  const maxRounds = 5;
  
  const startTime = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setReactionTimes([]);
    setRound(1);
    startRound();
  };

  const startRound = () => {
    setGameState('waiting');
    setMessage('Wait for Green...');
    
    // Random delay between 2 and 6 seconds
    const delay = 2000 + Math.random() * 4000;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      setMessage('TAP NOW!');
      startTime.current = Date.now();
    }, delay);
  };

  const handleTap = () => {
    if (gameState === 'waiting') {
      // Tapped too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('result');
      setMessage('Too Soon!');
      setCurrentReaction(0);
    } else if (gameState === 'ready') {
      // Good tap
      const reaction = Date.now() - startTime.current;
      setCurrentReaction(reaction);
      
      const newTimes = [...reactionTimes, reaction];
      setReactionTimes(newTimes);
      
      if (newTimes.length >= maxRounds) {
        setGameState('gameover');
        if (onGameComplete) {
          const avg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
          const score = Math.max(0, Math.floor((1000 - avg) * 5));
          onGameComplete(score, avg);
        }
      } else {
        setGameState('result');
        setMessage(`${reaction} ms`);
        setRound(prev => prev + 1);
      }
    } else if (gameState === 'result') {
      startRound();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting': return 'bg-red-500 hover:bg-red-600';
      case 'ready': return 'bg-green-500 hover:bg-green-600';
      case 'result': return currentReaction === 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-slate-800 hover:bg-slate-700';
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
          <Clock className="w-6 h-6 text-yellow-400" />
          <h1 className="text-xl font-bold">Reaction Timer</h1>
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
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Reaction Timer</h2>
            <p className="text-slate-400 mb-8">
              Wait for the screen to turn green, then tap as fast as you can. We will measure your exact reaction time over {maxRounds} rounds.
            </p>
            <button
              onClick={startGame}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" />
              Start Test
            </button>
          </motion.div>
        )}

        {(gameState === 'waiting' || gameState === 'ready' || gameState === 'result') && (
          <div className="w-full max-w-2xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Round</p>
                <p className="text-2xl font-bold text-yellow-400">{round}/{maxRounds}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Average</p>
                <p className="text-2xl font-bold text-white">
                  {reactionTimes.length > 0 
                    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) 
                    : '--'} ms
                </p>
              </div>
            </div>

            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleTap}
              className={`flex-1 w-full rounded-2xl border border-white/10 flex flex-col items-center justify-center transition-colors duration-100 ${getBackgroundColor()}`}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">{message}</h2>
              {gameState === 'result' && currentReaction > 0 && (
                <p className="text-xl text-white/80">Tap to continue</p>
              )}
              {gameState === 'result' && currentReaction === 0 && (
                <p className="text-xl text-white/80">Tap to try again</p>
              )}
            </motion.button>
          </div>
        )}

        {gameState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full"
          >
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Test Complete!</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8 mt-6">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">Average Time</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)}ms
                </p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">Best Time</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {Math.min(...reactionTimes)}ms
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
                className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
