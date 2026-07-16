import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, XCircle, Grid, Play } from 'lucide-react';

interface PlanningGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

type CellType = 'empty' | 'wall' | 'start' | 'end' | 'path';

export default function PlanningGame({ onBack, onGameComplete }: PlanningGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [gridSize, setGridSize] = useState(4);
  const [grid, setGrid] = useState<CellType[]>([]);
  const [path, setPath] = useState<number[]>([]);
  const [startPos, setStartPos] = useState(0);
  const [endPos, setEndPos] = useState(0);

  const generateLevel = (currentLevel: number) => {
    const size = Math.min(8, 3 + Math.floor(currentLevel / 3));
    setGridSize(size);
    
    let newGrid = Array(size * size).fill('empty') as CellType[];
    
    // Set start (top leftish) and end (bottom rightish)
    const start = 0;
    const end = size * size - 1;
    newGrid[start] = 'start';
    newGrid[end] = 'end';
    
    setStartPos(start);
    setEndPos(end);

    // Add some random walls
    const numWalls = Math.floor(size * size * 0.2) + Math.floor(currentLevel / 2);
    for (let i = 0; i < numWalls; i++) {
      let idx;
      do {
        idx = Math.floor(Math.random() * (size * size));
      } while (idx === start || idx === end || newGrid[idx] === 'wall');
      newGrid[idx] = 'wall';
    }

    setGrid(newGrid);
    setPath([start]);
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
    setTimeLeft(60);
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
    if (feedback !== null || grid[index] === 'wall') return;

    const currentPos = path[path.length - 1];
    
    // Allow moving to adjacent cell
    if (getNeighbors(currentPos, gridSize).includes(index)) {
      if (path.includes(index)) {
        // Backtrack
        const indexInPath = path.indexOf(index);
        setPath(path.slice(0, indexInPath + 1));
      } else {
        // Move forward
        const newPath = [...path, index];
        setPath(newPath);

        if (index === endPos) {
          setScore(s => s + 20 * level);
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

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Route Planning</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
            <Grid className="w-12 h-12 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Route Planning</h2>
          <p className="text-white/60 mb-12">
            Plan your route from the start point to the target while avoiding obstacles. Click adjacent squares to draw your path.
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
            <div className="mb-8 text-white/60 text-lg uppercase tracking-widest font-bold">
              Level {level}
            </div>
            
            <div className="relative p-2 bg-white/5 rounded-3xl border border-white/10">
              <div 
                className="grid gap-2"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  width: `${Math.min(100, Math.max(60, gridSize * 40))}px`,
                }}
              >
                {grid.map((cell, i) => {
                  const isStart = i === startPos;
                  const isEnd = i === endPos;
                  const isWall = cell === 'wall';
                  const isPath = path.includes(i);
                  const isCurrentPos = path[path.length - 1] === i;

                  return (
                    <button
                      key={i}
                      onClick={() => handleCellClick(i)}
                      className={`
                        aspect-square rounded-xl flex items-center justify-center transition-all
                        ${isWall ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}
                        ${isStart ? 'ring-2 ring-emerald-500 bg-emerald-500/20' : ''}
                        ${isEnd ? 'ring-2 ring-rose-500 bg-rose-500/20' : ''}
                        ${isPath && !isStart && !isEnd ? 'bg-indigo-500/40' : ''}
                        ${isCurrentPos ? 'ring-2 ring-indigo-400 scale-105' : ''}
                      `}
                    >
                      {isStart && <Play className="w-6 h-6 text-emerald-400" />}
                      {isEnd && <Target className="w-6 h-6 text-rose-400" />}
                      {isWall && <XCircle className="w-6 h-6 text-white/20" />}
                    </button>
                  );
                })}
              </div>
              
              {feedback === 'correct' && (
                <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm z-10">
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
