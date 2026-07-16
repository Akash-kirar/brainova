import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

interface PerfectPathGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function PerfectPathGame({ onBack, onGameComplete, difficulty }: PerfectPathGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [gridSize, setGridSize] = useState(3);
  const [path, setPath] = useState<number[]>([]);
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(8);
  const [obstacles, setObstacles] = useState<number[]>([]);

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
    const newSize = Math.min(3 + Math.floor(level / 3), 5);
    setGridSize(newSize);
    
    // Simplistic random start and end for now
    // A proper Hamiltonian path generator is complex, so we'll just require them to visit all non-obstacle cells.
    const start = 0;
    const end = newSize * newSize - 1;
    
    const obCount = Math.floor(newSize * newSize * 0.2);
    const newObstacles = [];
    while(newObstacles.length < obCount) {
      const idx = Math.floor(Math.random() * (newSize * newSize));
      if (idx !== start && idx !== end && !newObstacles.includes(idx)) {
        newObstacles.push(idx);
      }
    }
    
    setStartIdx(start);
    setEndIdx(end);
    setObstacles(newObstacles);
    setPath([start]);
  };

  const handleCellClick = (idx: number) => {
    if (gameState !== 'playing') return;
    if (obstacles.includes(idx)) return;
    
    const current = path[path.length - 1];
    
    // Check adjacency
    const row1 = Math.floor(current / gridSize);
    const col1 = current % gridSize;
    const row2 = Math.floor(idx / gridSize);
    const col2 = idx % gridSize;
    
    const isAdjacent = Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    
    if (isAdjacent) {
      if (!path.includes(idx)) {
        const newPath = [...path, idx];
        setPath(newPath);
        
        // Check win condition
        if (idx === endIdx) {
          const totalValid = gridSize * gridSize - obstacles.length;
          if (newPath.length === totalValid) {
            setScore(s => s + 20 * level);
            setLevel(l => l + 1);
          } else {
            // Reached end but didn't visit all
            setTimeLeft(t => Math.max(0, t - 5));
            setPath([startIdx]); // Reset path
          }
        }
      } else if (idx === path[path.length - 2]) {
        // Allow backtracking
        setPath(path.slice(0, -1));
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
          <div className="w-full max-w-md flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Connect start to end</h2>
              <p className="text-white/60">Fill all empty cells!</p>
            </div>
            
            <div 
              className="grid gap-2 bg-[#1a1a1c] p-4 rounded-xl border border-white/10"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                const isObstacle = obstacles.includes(i);
                const isStart = i === startIdx;
                const isEnd = i === endIdx;
                const pathIndex = path.indexOf(i);
                const isPath = pathIndex !== -1;
                const isCurrent = path[path.length - 1] === i;
                
                return (
                  <button
                    key={i}
                    onClick={() => handleCellClick(i)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all ${
                      isObstacle ? 'bg-white/5' :
                      isStart ? 'bg-green-500/80 border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]' :
                      isEnd ? 'bg-blue-500/80 border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
                      isCurrent ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]' :
                      isPath ? 'bg-cyan-500/50' :
                      'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {isStart && <span className="text-white font-bold text-sm">START</span>}
                    {isEnd && <span className="text-white font-bold text-sm">END</span>}
                    {isPath && !isStart && !isEnd && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPath([startIdx])}
              className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 text-sm font-bold"
            >
              Reset Path
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
