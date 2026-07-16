import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

interface SymmetryTestGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function SymmetryTestGame({ onBack, onGameComplete, difficulty }: SymmetryTestGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const gridSize = Math.min(3 + Math.floor(level / 2), 6);
  const [leftGrid, setLeftGrid] = useState<boolean[]>([]);
  const [rightGrid, setRightGrid] = useState<boolean[]>([]);

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
    const totalCells = gridSize * gridSize;
    const newLeft = Array(totalCells).fill(false);
    
    // Fill left grid randomly
    const fillCount = Math.max(3, Math.floor(totalCells * 0.4));
    let filled = 0;
    while (filled < fillCount) {
      const idx = Math.floor(Math.random() * totalCells);
      if (!newLeft[idx]) {
        newLeft[idx] = true;
        filled++;
      }
    }
    
    setLeftGrid(newLeft);
    setRightGrid(Array(totalCells).fill(false));
  };

  const toggleRightCell = (index: number) => {
    if (gameState !== 'playing') return;
    const newRight = [...rightGrid];
    newRight[index] = !newRight[index];
    setRightGrid(newRight);
  };

  const checkSymmetry = () => {
    // Check if rightGrid is a horizontal mirror of leftGrid
    let isCorrect = true;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const leftIdx = r * gridSize + c;
        const rightMirrorCol = gridSize - 1 - c;
        const rightIdx = r * gridSize + rightMirrorCol;
        
        if (leftGrid[leftIdx] !== rightGrid[rightIdx]) {
          isCorrect = false;
          break;
        }
      }
      if (!isCorrect) break;
    }
    
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
          <div className="w-full max-w-2xl flex flex-col items-center gap-8">
            <h2 className="text-2xl font-bold mb-4">Create the Mirror Image</h2>
            
            <div className="flex gap-4 items-center">
              {/* Left Grid */}
              <div 
                className="grid gap-1 bg-[#1a1a1c] p-2 rounded-xl border border-white/10"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
              >
                {leftGrid.map((isActive, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-md ${isActive ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/5'}`}
                  />
                ))}
              </div>
              
              <div className="w-2 h-full bg-white/20 rounded-full flex flex-col justify-center relative">
                <div className="absolute inset-y-0 w-px bg-cyan-500/50 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              </div>
              
              {/* Right Grid */}
              <div 
                className="grid gap-1 bg-[#1a1a1c] p-2 rounded-xl border border-white/10"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
              >
                {rightGrid.map((isActive, i) => (
                  <button 
                    key={i} 
                    onClick={() => toggleRightCell(i)}
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-md transition-colors ${isActive ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/10 hover:bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
            
            <button
              onClick={checkSymmetry}
              className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)] mt-8"
            >
              Check Symmetry
            </button>
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
