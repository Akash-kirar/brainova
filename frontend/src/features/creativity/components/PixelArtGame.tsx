import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap, Brush, Trash2 } from 'lucide-react';

interface PixelArtGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', 
  '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899',
  '#ffffff', '#9ca3af', '#374151', '#000000', '#fcd34d'
];

export default function PixelArtGame({ onBack, onGameComplete, difficulty }: PixelArtGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const gridSize = 12;
  const [grid, setGrid] = useState<string[]>(Array(gridSize * gridSize).fill(''));
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const handleCellAction = (index: number) => {
    if (gameState !== 'playing') return;
    const newGrid = [...grid];
    newGrid[index] = selectedColor;
    setGrid(newGrid);
  };

  const clearGrid = () => {
    setGrid(Array(gridSize * gridSize).fill(''));
  };

  const handleSubmit = () => {
    if (gameState !== 'playing') return;
    
    // Reward for number of colored cells (more creative = more points, loosely)
    const filledCells = grid.filter(c => c !== '').length;
    const points = filledCells * 2;
    
    setScore(s => s + points + 100);
    setTimeLeft(t => Math.min(120, t + 30));
    setLevel(l => l + 1);
    clearGrid();
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white select-none">
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
          <div className="font-bold text-lg text-white/50">Art {level}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto gap-8">
        {gameState === 'playing' ? (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Pixel Art Studio</h2>
              <p className="text-white/60">Draw anything you like!</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${selectedColor === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <button
                onClick={() => setSelectedColor('')}
                className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform ${selectedColor === '' ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'}`}
              >
                <Trash2 className="w-4 h-4 text-white/50" />
              </button>
            </div>
            
            <div 
              className="bg-white/5 p-4 rounded-xl border border-white/10"
              onMouseLeave={() => setIsDrawing(false)}
              onMouseUp={() => setIsDrawing(false)}
            >
              <div 
                className="grid gap-[1px] bg-white/10 border border-white/10"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
              >
                {grid.map((color, i) => (
                  <div
                    key={i}
                    onMouseDown={() => { setIsDrawing(true); handleCellAction(i); }}
                    onMouseEnter={() => { if (isDrawing) handleCellAction(i); }}
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-[#1a1a1c] cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: color || '#1a1a1c' }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={clearGrid}
                className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 text-sm font-bold transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
              >
                Finish Art
              </button>
            </div>
          </>
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
