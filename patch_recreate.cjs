const fs = require('fs');

const colorAnomaly = `import React, { useState, useEffect } from 'react';
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
      color: i === anomalyIndex ? \`hsl(\${anomalyColor.h}, \${anomalyColor.s}%, \${anomalyColor.l}%)\` : \`hsl(\${baseColor.h}, \${baseColor.s}%, \${baseColor.l}%)\`
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
              style={{ gridTemplateColumns: \`repeat(\${gridSize}, minmax(0, 1fr))\` }}
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
}`;
fs.writeFileSync('src/features/observation/components/ColorAnomalyGame.tsx', colorAnomaly);

const shapeCount = `import React, { useState, useEffect } from 'react';
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
              {TargetIcon && <TargetIcon className={\`w-12 h-12 \${targetColor} fill-current\`} />}
            </div>
            
            <div 
              className="grid gap-3 w-full aspect-square p-6 bg-white/5 rounded-3xl mb-6"
              style={{ gridTemplateColumns: \`repeat(\${Math.sqrt(grid.length)}, minmax(0, 1fr))\` }}
            >
              {grid.map(tile => (
                <div key={tile.id} className="flex items-center justify-center">
                  <tile.Shape className={\`w-full h-full p-2 \${tile.color} fill-current\`} />
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
}`;
fs.writeFileSync('src/features/observation/components/ShapeCountGame.tsx', shapeCount);

const shadowMatch = `import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap, Target, Umbrella, Plane, Scissors, Anchor, Bell, Camera, Car, Cloud, Music } from 'lucide-react';

interface ShadowMatchGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const ICONS = [Target, Umbrella, Plane, Scissors, Anchor, Bell, Camera, Car, Cloud, Music];

export default function ShadowMatchGame({ onBack, onGameComplete, difficulty }: ShadowMatchGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [targetIcon, setTargetIcon] = useState<any>(null);
  const [targetRotation, setTargetRotation] = useState(0);
  const [options, setOptions] = useState<{id: number, Icon: any, rotation: number, isCorrect: boolean}[]>([]);

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
    const iconIndex = Math.floor(Math.random() * ICONS.length);
    const selectedIcon = ICONS[iconIndex];
    const correctRotation = Math.floor(Math.random() * 8) * 45; // 0, 45, 90, 135...
    
    setTargetIcon(() => selectedIcon);
    setTargetRotation(correctRotation);
    
    let opts = [];
    opts.push({ id: 0, Icon: selectedIcon, rotation: correctRotation, isCorrect: true });
    
    for (let i = 1; i < 4; i++) {
      let isSameIcon = Math.random() > 0.5;
      let rot = correctRotation;
      while (rot === correctRotation) {
        rot = Math.floor(Math.random() * 8) * 45;
      }
      
      opts.push({
        id: i,
        Icon: isSameIcon ? selectedIcon : ICONS[Math.floor(Math.random() * ICONS.length)],
        rotation: rot,
        isCorrect: false
      });
    }
    
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  const handleOptionClick = (isCorrect: boolean) => {
    if (gameState !== 'playing') return;
    
    if (isCorrect) {
      setScore(s => s + 20 * level);
      setLevel(l => l + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 5));
    }
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
  };

  const TargetComponent = targetIcon;

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
            <h2 className="text-2xl font-bold text-center">Match the Shadow</h2>
            
            {TargetComponent && (
              <div className="w-32 h-32 bg-white/5 rounded-3xl flex items-center justify-center shadow-lg border border-white/10">
                <TargetComponent 
                  className="w-20 h-20 text-blue-400" 
                  style={{ transform: \`rotate(\${targetRotation}deg)\` }}
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt.isCorrect)}
                  className="aspect-square bg-black border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <opt.Icon 
                    className="w-16 h-16 text-black fill-white/80" 
                    style={{ transform: \`rotate(\${opt.rotation}deg)\` }}
                  />
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
}`;
fs.writeFileSync('src/features/observation/components/ShadowMatchGame.tsx', shadowMatch);


const findIdentical = `import React, { useState, useEffect } from 'react';
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
              style={{ gridTemplateColumns: \`repeat(\${Math.sqrt(grid.length)}, minmax(0, 1fr))\` }}
            >
              {grid.map(tile => (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile.id)}
                  className={\`flex items-center justify-center p-2 rounded-xl border transition-all duration-200 \${
                    selectedIds.includes(tile.id) 
                      ? 'bg-white/20 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-95' 
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                  }\`}
                >
                  <tile.Icon className={\`w-full h-full max-w-[40px] max-h-[40px] \${tile.color}\`} />
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
}`;
fs.writeFileSync('src/features/observation/components/FindIdenticalGame.tsx', findIdentical);

console.log('done replacing');
