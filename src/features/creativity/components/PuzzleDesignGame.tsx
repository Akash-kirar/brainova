import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, Box, RotateCcw } from 'lucide-react';

interface PuzzleDesignGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function PuzzleDesignGame({ onBack, onGameComplete }: PuzzleDesignGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [gridSize, setGridSize] = useState(3);
  const [path, setPath] = useState<number[]>([0]);

  const generateLevel = (currentLevel: number) => {
    const size = Math.min(6, 3 + Math.floor((currentLevel - 1) / 2));
    setGridSize(size);
    setPath([0]);
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
    setTimeLeft(90);
    setGameState('playing');
    generateLevel(1);
  };

  const getNeighbors = (pos: number, size: number) => {
    const neighbors = [];
    if (pos >= size) neighbors.push(pos - size); // top
    if (pos < size * (size - 1)) neighbors.push(pos + size); // bottom
    if (pos % size !== 0) neighbors.push(pos - 1); // left
    if (pos % size !== size - 1) neighbors.push(pos + 1); // right
    return neighbors;
  };

  const handleCellClick = (index: number) => {
    if (feedback !== null) return;

    const currentPos = path[path.length - 1];
    
    if (index === currentPos) {
      // Undo last step (unless it's the start)
      if (path.length > 1) {
        setPath(path.slice(0, -1));
      }
      return;
    }

    if (getNeighbors(currentPos, gridSize).includes(index)) {
      if (path.includes(index)) {
        // Backtrack to this cell
        const indexInPath = path.indexOf(index);
        setPath(path.slice(0, indexInPath + 1));
      } else {
        // Move forward
        const newPath = [...path, index];
        setPath(newPath);

        // Check win condition (all cells covered, ends at bottom right)
        if (newPath.length === gridSize * gridSize && index === gridSize * gridSize - 1) {
          setScore(s => s + 50 * level);
          setFeedback('correct');
          setTimeout(() => {
            setFeedback(null);
            setLevel(l => l + 1);
            generateLevel(level + 1);
          }, 800);
        }
      }
    }
  };

  const resetPath = () => {
    setPath([0]);
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Puzzle Design</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6">
            <Box className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Hamiltonian Path</h2>
          <p className="text-white/60 mb-12">
            Design a single continuous path that starts at the top-left, ends at the bottom-right, and visits EVERY square exactly once.
          </p>
          <button 
            onClick={startGame}
            className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full text-xl transition-all w-full"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white overflow-hidden">
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
            <div className="flex items-center justify-between w-full mb-8 px-4">
              <div className="text-white/60 text-lg uppercase tracking-widest font-bold">
                Level {level}
              </div>
              <button 
                onClick={resetPath}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Reset Path"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative p-2 bg-white/5 rounded-3xl border border-white/10">
              <div 
                className="grid gap-2"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  width: `${Math.min(320, Math.max(200, gridSize * 60))}px`,
                }}
              >
                {Array(gridSize * gridSize).fill(0).map((_, i) => {
                  const isStart = i === 0;
                  const isEnd = i === gridSize * gridSize - 1;
                  const pathIndex = path.indexOf(i);
                  const isPath = pathIndex !== -1;
                  const isCurrentPos = path[path.length - 1] === i;

                  return (
                    <button
                      key={i}
                      onClick={() => handleCellClick(i)}
                      className={`
                        aspect-square rounded-xl flex items-center justify-center transition-all duration-200
                        ${isStart ? 'ring-2 ring-emerald-500' : ''}
                        ${isEnd ? 'ring-2 ring-rose-500' : ''}
                        ${isPath ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 hover:bg-white/10'}
                        ${isCurrentPos ? 'ring-2 ring-white scale-110 z-10' : ''}
                      `}
                    >
                      {isPath && (
                        <span className="text-white font-bold opacity-50">
                          {pathIndex + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {feedback === 'correct' && (
                <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm z-20">
                  <CheckCircle2 className="w-24 h-24 text-emerald-400" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-2">Level Reached: {level}</p>
            <p className="text-xl text-white/60 mb-8">Final Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
