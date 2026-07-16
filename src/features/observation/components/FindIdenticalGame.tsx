import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap, Star, Heart, Moon, Sun, Flag, Coffee, Umbrella, Plane, Scissors, Bell, Camera, Car, Cloud, Music, Box, Triangle, Hexagon, Circle } from 'lucide-react';

interface FindIdenticalGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const ICONS = [Star, Heart, Moon, Sun, Flag, Coffee, Umbrella, Plane, Scissors, Bell, Camera, Car, Cloud, Music, Box, Triangle, Hexagon, Circle];
const COLORS = ['text-red-400', 'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-purple-400', 'text-pink-400', 'text-cyan-400'];

export default function FindIdenticalGame({ onBack, onGameComplete, difficulty }: FindIdenticalGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [grid, setGrid] = useState<{id: number, Icon: any, color: string, isIdentical: boolean, isSelected: boolean}[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
    const size = Math.min(3 + Math.floor(level / 3), 6);
    const totalItems = size * size;
    
    // Choose the identical pair
    const targetIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
    const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    const id1 = Math.floor(Math.random() * totalItems);
    let id2 = id1;
    while (id2 === id1) {
      id2 = Math.floor(Math.random() * totalItems);
    }
    
    let newGrid = [];
    for (let i = 0; i < totalItems; i++) {
      if (i === id1 || i === id2) {
        newGrid.push({ id: i, Icon: targetIcon, color: targetColor, isIdentical: true, isSelected: false });
      } else {
        let randIcon, randColor;
        do {
          randIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
          randColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        } while (randIcon === targetIcon && randColor === targetColor);
        
        newGrid.push({ id: i, Icon: randIcon, color: randColor, isIdentical: false, isSelected: false });
      }
    }
    
    setGrid(newGrid);
    setSelectedIds([]);
  };

  const handleTileClick = (id: number) => {
    if (gameState !== 'playing') return;
    
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
      return;
    }
    
    const newSelected = [...selectedIds, id];
    setSelectedIds(newSelected);
    
    if (newSelected.length === 2) {
      const item1 = grid.find(i => i.id === newSelected[0]);
      const item2 = grid.find(i => i.id === newSelected[1]);
      
      if (item1?.isIdentical && item2?.isIdentical) {
        // Success
        setScore(s => s + 20 * level);
        setTimeout(() => setLevel(l => l + 1), 500);
      } else {
        // Fail
        setTimeLeft(t => Math.max(0, t - 5));
        setTimeout(() => setSelectedIds([]), 500);
      }
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
            <h2 className="text-2xl font-bold text-center">Find the identical pair</h2>
            
            <div 
              className="grid gap-2 w-full aspect-square p-4 bg-white/5 rounded-3xl"
              style={{ gridTemplateColumns: `repeat(${Math.sqrt(grid.length)}, minmax(0, 1fr))` }}
            >
              {grid.map(tile => (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile.id)}
                  className={`flex items-center justify-center p-2 rounded-xl border transition-all duration-200 ${
                    selectedIds.includes(tile.id) 
                      ? 'bg-white/20 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-95' 
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <tile.Icon className={`w-full h-full max-w-[40px] max-h-[40px] ${tile.color}`} />
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