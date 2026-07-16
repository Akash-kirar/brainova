import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

interface BlockCountGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function BlockCountGame({ onBack, onGameComplete, difficulty }: BlockCountGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  
  // We represent the grid as a 2D array of heights
  const [grid, setGrid] = useState<number[][]>([]);

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
    const size = Math.min(3 + Math.floor(level / 3), 5);
    const maxHeight = Math.min(2 + Math.floor(level / 2), 5);
    
    let total = 0;
    const newGrid: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
    
    // Fill grid ensuring blocks are hidden
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Back blocks tend to be taller
        const backBias = (size - r) + (size - c); 
        const height = Math.floor(Math.random() * (maxHeight * (backBias / (size * 2)) + 1));
        newGrid[r][c] = height;
        total += height;
      }
    }
    
    // Ensure at least some blocks
    if (total === 0) {
      newGrid[0][0] = 1;
      total = 1;
    }
    
    setGrid(newGrid);
    setTotalBlocks(total);
    
    const opts = new Set<number>();
    opts.add(total);
    while (opts.size < 4) {
      const wrong = total + Math.floor(Math.random() * 7) - 3;
      if (wrong > 0 && wrong !== total) {
        opts.add(wrong);
      }
    }
    setOptions(Array.from(opts).sort((a, b) => a - b));
  };

  const handleGuess = (val: number) => {
    if (gameState !== 'playing') return;
    
    if (val === totalBlocks) {
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
            <h2 className="text-2xl font-bold mb-8">How many blocks total?</h2>
            
            {/* Isometric Rendering */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div 
                className="relative"
                style={{
                  transform: 'rotateX(60deg) rotateZ(-45deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {grid.map((row, r) => 
                  row.map((height, c) => {
                    if (height === 0) return null;
                    const blocks = [];
                    for (let h = 0; h < height; h++) {
                      blocks.push(
                        <div 
                          key={`${r}-${c}-${h}`}
                          className="absolute w-10 h-10 border border-black/20"
                          style={{
                            left: `${c * 40}px`,
                            top: `${r * 40}px`,
                            transform: `translateZ(${h * 40}px)`,
                            backgroundColor: h === height - 1 ? '#0ea5e9' : '#0284c7', // Top vs sides
                            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
                          }}
                        />
                      );
                    }
                    return blocks;
                  })
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-12">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleGuess(opt)}
                  className="py-4 bg-white/10 rounded-xl font-bold text-2xl hover:bg-white/20 transition-colors"
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
