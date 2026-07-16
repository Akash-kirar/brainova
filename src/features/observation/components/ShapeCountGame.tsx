import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Zap, Circle, Square, Triangle, Hexagon } from 'lucide-react';

interface ShapeCountGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const SHAPES = [Circle, Square, Triangle, Hexagon];
const COLORS = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500'];

export default function ShapeCountGame({ onBack, onGameComplete, difficulty }: ShapeCountGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [grid, setGrid] = useState<{id: number, Shape: any, color: string}[]>([]);
  const [targetShape, setTargetShape] = useState<any>(null);
  const [targetColor, setTargetColor] = useState<string>('');
  const [targetCount, setTargetCount] = useState(0);
  const [options, setOptions] = useState<number[]>([]);

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
    const size = Math.min(3 + Math.floor(level / 2), 6);
    const totalItems = size * size;
    
    const newGrid = [];
    for (let i = 0; i < totalItems; i++) {
      newGrid.push({
        id: i,
        Shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
    
    // Pick target
    const targetItem = newGrid[Math.floor(Math.random() * newGrid.length)];
    const tShape = targetItem.Shape;
    const tColor = targetItem.color;
    
    const count = newGrid.filter(i => i.Shape === tShape && i.color === tColor).length;
    
    setGrid(newGrid);
    setTargetShape(() => tShape);
    setTargetColor(tColor);
    setTargetCount(count);
    
    // Generate options
    let opts = new Set<number>();
    opts.add(count);
    while (opts.size < 4) {
      let r = count + Math.floor(Math.random() * 5) - 2;
      if (r >= 0) opts.add(r);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  const handleOptionClick = (opt: number) => {
    if (gameState !== 'playing') return;
    
    if (opt === targetCount) {
      setScore(s => s + 15 * level);
      setLevel(l => l + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 5));
    }
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
  };

  const TargetIcon = targetShape;

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
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-2xl font-bold text-center mb-2">How many?</h2>
              {TargetIcon && <TargetIcon className={`w-12 h-12 ${targetColor} fill-current`} />}
            </div>
            
            <div 
              className="grid gap-3 w-full aspect-square p-6 bg-white/5 rounded-3xl mb-6"
              style={{ gridTemplateColumns: `repeat(${Math.sqrt(grid.length)}, minmax(0, 1fr))` }}
            >
              {grid.map(tile => (
                <div key={tile.id} className="flex items-center justify-center">
                  <tile.Shape className={`w-full h-full p-2 ${tile.color} fill-current`} />
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="py-4 bg-indigo-500/20 text-indigo-300 rounded-xl font-bold text-2xl hover:bg-indigo-500/30 transition-colors"
                >
                  {opt}
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