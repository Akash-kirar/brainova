import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpotTheDifferenceGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function SpotTheDifferenceGame({ onBack, onGameComplete }: SpotTheDifferenceGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  // Game state
  const [gridSize, setGridSize] = useState(4);
  const [targetIndex, setTargetIndex] = useState(0);
  const [baseChar, setBaseChar] = useState('');
  const [diffChar, setDiffChar] = useState('');

  const pairs = [
    { base: 'O', diff: '0' },
    { base: 'I', diff: 'l' },
    { base: 'p', diff: 'q' },
    { base: 'b', diff: 'd' },
    { base: '8', diff: 'B' },
    { base: 'v', diff: 'u' },
    { base: 'rn', diff: 'm' },
    { base: 'c', diff: 'e' },
    { base: 'x', diff: '×' },
    { base: ':', diff: ';' }
  ];

  const generateLevel = (currentLevel: number) => {
    const size = Math.min(10, 3 + Math.floor(currentLevel / 2));
    setGridSize(size);
    
    const pairIndex = Math.floor(Math.random() * pairs.length);
    const pair = pairs[pairIndex];
    // Randomly swap base and diff
    if (Math.random() > 0.5) {
      setBaseChar(pair.base);
      setDiffChar(pair.diff);
    } else {
      setBaseChar(pair.diff);
      setDiffChar(pair.base);
    }
    
    setTargetIndex(Math.floor(Math.random() * (size * size)));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      setTimeout(() => {
        onGameComplete(score, level);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, level, onGameComplete]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(45);
    setGameState('playing');
    generateLevel(1);
  };

  const handleCellClick = (index: number) => {
    if (feedback !== null) return;
    
    if (index === targetIndex) {
      setScore(s => s + 10 * level);
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setLevel(l => l + 1);
        generateLevel(level + 1);
      }, 500);
    } else {
      setScore(s => Math.max(0, s - 5));
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
      }, 500);
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Spot the Difference</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Spot the Difference</h2>
          <p className="text-white/60 mb-12 max-w-sm">
            Find the odd one out in the grid of characters as quickly as possible.
          </p>
          <button 
            onClick={startGame}
            className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full text-xl transition-all"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-xl">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-400" />
            <span className="font-bold text-xl">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {gameState === 'playing' ? (
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="mb-4 text-white/60 text-lg">Level {level}</div>
            
            <div className="relative">
              <div 
                className="grid gap-2 p-4 bg-white/5 rounded-2xl"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  width: `${Math.min(100, Math.max(60, gridSize * 12))}vw`,
                  maxWidth: '400px'
                }}
              >
                {Array.from({length: gridSize * gridSize}).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleCellClick(i)}
                    className="aspect-square flex items-center justify-center text-2xl md:text-3xl font-mono font-bold bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    {i === targetIndex ? diffChar : baseChar}
                  </button>
                ))}
              </div>
              
              {feedback === 'correct' && (
                <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm z-10">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                </div>
              )}
              {feedback === 'wrong' && (
                <div className="absolute inset-0 bg-rose-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm z-10">
                  <XCircle className="w-16 h-16 text-rose-400" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-2">Level Reached: {level}</p>
            <p className="text-xl text-white/60 mb-8">Final Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
