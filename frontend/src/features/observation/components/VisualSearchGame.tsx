import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VisualSearchGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function VisualSearchGame({ onBack, onGameComplete }: VisualSearchGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const [gridSize, setGridSize] = useState(5);
  const [items, setItems] = useState<{id: number, type: number, color: string, isTarget: boolean}[]>([]);
  const [targetType, setTargetType] = useState(0);
  const [targetColor, setTargetColor] = useState('');

  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
  // We'll use border radius to differentiate types: 0=square, 1=circle, 2=diamond
  
  const generateLevel = (currentLevel: number) => {
    const size = Math.min(8, 4 + Math.floor(currentLevel / 3));
    setGridSize(size);
    
    // Choose target properties
    const tType = Math.floor(Math.random() * 3);
    const tColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetType(tType);
    setTargetColor(tColor);
    
    const targetIndex = Math.floor(Math.random() * (size * size));
    const newItems = [];
    
    for (let i = 0; i < size * size; i++) {
      if (i === targetIndex) {
        newItems.push({ id: i, type: tType, color: tColor, isTarget: true });
      } else {
        // Create distractors that share at least one feature with target (conjunction search)
        // or share nothing (feature search)
        let type = tType;
        let color = tColor;
        
        while (type === tType && color === tColor) {
          if (Math.random() > 0.5) {
            type = Math.floor(Math.random() * 3);
            color = tColor;
          } else {
            type = tType;
            color = colors[Math.floor(Math.random() * colors.length)];
          }
        }
        
        newItems.push({ id: i, type, color, isTarget: false });
      }
    }
    
    setItems(newItems);
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

  const handleItemClick = (isTarget: boolean) => {
    if (feedback !== null) return;
    
    if (isTarget) {
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

  const getItemStyle = (type: number, color: string) => {
    switch (type) {
      case 0: // Square
        return { backgroundColor: color, borderRadius: '4px' };
      case 1: // Circle
        return { backgroundColor: color, borderRadius: '50%' };
      case 2: // Diamond
        return { backgroundColor: color, borderRadius: '4px', transform: 'rotate(45deg) scale(0.7)' };
      default:
        return { backgroundColor: color };
    }
  };

  const TargetDisplay = ({ type, color }: { type: number, color: string }) => (
    <div className="w-8 h-8" style={getItemStyle(type, color)} />
  );

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Visual Search</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-12 h-12 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Visual Search</h2>
          <p className="text-white/60 mb-12 max-w-sm">
            Scan the grid to find the unique item combining a specific shape and color.
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
            <div className="mb-6 flex items-center gap-4 bg-white/10 px-6 py-3 rounded-full">
              <span className="text-white/60 text-lg">Find:</span>
              <div className="flex items-center justify-center w-10 h-10">
                <TargetDisplay type={targetType} color={targetColor} />
              </div>
            </div>
            
            <div className="relative">
              <div 
                className="grid gap-2 p-4 bg-white/5 rounded-2xl"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  width: `${Math.min(100, Math.max(60, gridSize * 10))}vw`,
                  maxWidth: '400px'
                }}
              >
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.isTarget)}
                    className="aspect-square flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-colors overflow-hidden p-2"
                  >
                    <div className="w-full h-full" style={getItemStyle(item.type, item.color)} />
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
