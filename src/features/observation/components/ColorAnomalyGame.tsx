import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

interface ColorAnomalyGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const COLORS = [
  { h: 0, s: 80, l: 50 }, // Red
  { h: 120, s: 80, l: 40 }, // Green
  { h: 240, s: 80, l: 50 }, // Blue
  { h: 280, s: 80, l: 50 }, // Purple
  { h: 30, s: 90, l: 50 }, // Orange
];

export default function ColorAnomalyGame({ onBack, onGameComplete, difficulty }: ColorAnomalyGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  const [grid, setGrid] = useState<{id: number, isAnomaly: boolean, color: string}[]>([]);
  const [gridSize, setGridSize] = useState(3);

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
    const size = Math.min(3 + Math.floor(level / 3), 8);
    setGridSize(size);
    
    const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const difficultyMultiplier = difficulty === 'hard' ? 0.3 : difficulty === 'medium' ? 0.6 : 1;
    const diff = Math.max(2, 20 - level * difficultyMultiplier); 
    
    const anomalyColor = { ...baseColor, l: baseColor.l + diff };
    
    const totalItems = size * size;
    const anomalyIndex = Math.floor(Math.random() * totalItems);
    
    const newGrid = Array(totalItems).fill(null).map((_, i) => ({
      id: i,
      isAnomaly: i === anomalyIndex,
      color: i === anomalyIndex ? `hsl(${anomalyColor.h}, ${anomalyColor.s}%, ${anomalyColor.l}%)` : `hsl(${baseColor.h}, ${baseColor.s}%, ${baseColor.l}%)`
    }));
    
    setGrid(newGrid);
  };

  const handleTileClick = (isAnomaly: boolean) => {
    if (gameState !== 'playing') return;
    
    if (isAnomaly) {
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
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold text-center">Find the odd color out</h2>
            
            <div 
              className="grid gap-2 w-full aspect-square p-4 bg-white/5 rounded-2xl"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
              {grid.map(tile => (
                <motion.button
                  key={tile.id}
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleTileClick(tile.isAnomaly)}
                  className="rounded-lg shadow-sm"
                  style={{ backgroundColor: tile.color }}
                />
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