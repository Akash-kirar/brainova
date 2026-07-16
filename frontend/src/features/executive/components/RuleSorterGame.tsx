import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Zap, Square, Circle, Triangle, Hexagon } from 'lucide-react';

interface RuleSorterGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const SHAPES = [Square, Circle, Triangle, Hexagon];
const COLORS = ['text-blue-500', 'text-red-500', 'text-green-500', 'text-yellow-500'];

export default function RuleSorterGame({ onBack, onGameComplete, difficulty }: RuleSorterGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [currentRule, setCurrentRule] = useState<'color' | 'shape'>('color');
  const [targetItem, setTargetItem] = useState<any>(null);
  const [buckets, setBuckets] = useState<any[]>([]);

  useEffect(() => {
    generateLevel();
  }, [level]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const generateLevel = () => {
    const isColorRule = Math.random() > 0.5;
    setCurrentRule(isColorRule ? 'color' : 'shape');

    const shape1 = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    let shape2 = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    while (shape2 === shape1) shape2 = SHAPES[Math.floor(Math.random() * SHAPES.length)];

    const color1 = COLORS[Math.floor(Math.random() * COLORS.length)];
    let color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
    while (color2 === color1) color2 = COLORS[Math.floor(Math.random() * COLORS.length)];

    const targetShape = Math.random() > 0.5 ? shape1 : shape2;
    const targetColor = Math.random() > 0.5 ? color1 : color2;

    setTargetItem({ Shape: targetShape, color: targetColor });
    setBuckets([
      { Shape: shape1, color: color1 },
      { Shape: shape2, color: color2 }
    ]);
  };

  const handleBucketClick = (bucket: any) => {
    if (gameState !== 'playing') return;
    
    let isCorrect = false;
    if (currentRule === 'color') {
      isCorrect = bucket.color === targetItem.color;
    } else {
      isCorrect = bucket.Shape === targetItem.Shape;
    }
    
    if (isCorrect) {
      setScore(s => s + 10 * level);
      setLevel(l => l + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 5));
    }
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
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
          <div className="font-bold text-lg text-white/50">Lvl {level}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {gameState === 'playing' ? (
          <div className="w-full max-w-md flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Match by:</h2>
              <div className="bg-white/10 px-6 py-2 rounded-full inline-block">
                <span className="text-3xl font-black uppercase tracking-wider text-white">
                  {currentRule}
                </span>
              </div>
            </div>
            
            {targetItem && (
              <div className="w-32 h-32 bg-white/5 rounded-3xl flex items-center justify-center shadow-lg border border-white/10 my-4">
                <targetItem.Shape className={`w-20 h-20 ${targetItem.color} fill-current`} />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 w-full">
              {buckets.map((bucket, i) => (
                <button
                  key={i}
                  onClick={() => handleBucketClick(bucket)}
                  className="aspect-square bg-[#1a1a1c] border border-white/5 rounded-3xl flex flex-col items-center justify-center hover:bg-[#2a2a2c] transition-colors"
                >
                  <bucket.Shape className={`w-16 h-16 ${bucket.color} fill-current mb-4`} />
                  <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Select</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-8">Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
