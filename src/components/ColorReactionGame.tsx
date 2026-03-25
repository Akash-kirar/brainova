import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Activity, Play, RotateCcw, Trophy, Check, X } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface ColorReactionGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const COLORS = [
  { name: 'RED', value: '#f43f5e' },
  { name: 'BLUE', value: '#3b82f6' },
  { name: 'GREEN', value: '#10b981' },
  { name: 'YELLOW', value: '#eab308' },
  { name: 'PURPLE', value: '#a855f7' },
];

export default function ColorReactionGame({ onBack, onGameComplete }: ColorReactionGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [word, setWord] = useState(COLORS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [isMatch, setIsMatch] = useState(true);

  const generateRound = useCallback(() => {
    const match = Math.random() > 0.5;
    const wordIndex = Math.floor(Math.random() * COLORS.length);
    
    let colorIndex = wordIndex;
    if (!match) {
      do {
        colorIndex = Math.floor(Math.random() * COLORS.length);
      } while (colorIndex === wordIndex);
    }
    
    setWord(COLORS[wordIndex]);
    setColor(COLORS[colorIndex]);
    setIsMatch(match);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateRound();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(score, 1);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, onGameComplete]);

  const handleAnswer = (answer: boolean) => {
    if (answer === isMatch) {
      setScore(s => s + 10);
    } else {
      setScore(s => Math.max(0, s - 5));
    }
    generateRound();
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-lg">Color Reaction</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-3xl bg-blue-500/20 flex items-center justify-center mx-auto mb-8">
                <Activity className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Color Reaction</h2>
              <p className="text-white/60 mb-12">Does the meaning of the word match its color? Answer as fast as you can!</p>
              <button onClick={startGame} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md flex flex-col items-center">
              <div className="flex justify-between w-full mb-8 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Time</span>
                  <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-rose-400' : 'text-blue-400'}`}>
                    0:{timeLeft.toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Score</span>
                  <span className="text-2xl font-bold">{score}</span>
                </div>
              </div>

              <div className="bg-[#1a1a1c] p-12 rounded-3xl border border-white/5 mb-12 w-full flex flex-col items-center justify-center min-h-[200px]">
                <span 
                  className="text-6xl font-black tracking-widest"
                  style={{ color: color.value }}
                >
                  {word.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => handleAnswer(false)}
                  className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-400 font-bold py-6 rounded-2xl transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <X className="w-8 h-8" />
                  NO MATCH
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 font-bold py-6 rounded-2xl transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Check className="w-8 h-8" />
                  MATCH
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
              <p className="text-white/60 mb-8">Your reaction score:</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5">
                <span className="text-5xl font-bold text-blue-400">{score}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
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
