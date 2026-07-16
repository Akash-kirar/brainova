import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Grid, Lightbulb } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface SmartGridPuzzleGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

export default function SmartGridPuzzleGame({ onBack, onGameComplete, difficulty = 'easy' }: SmartGridPuzzleGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  
  const gridSize = Math.min(3 + Math.floor((level - 1) / 3), 5); // 3x3 to 5x5

  const generateGrid = useCallback((size: number) => {
    // Start with all false (lights out)
    let newGrid = Array(size).fill(false).map(() => Array(size).fill(false));
    
    // Simulate random clicks to ensure it's solvable
    const clicks = size * size;
    for (let i = 0; i < clicks; i++) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      newGrid = toggleCells(newGrid, r, c, size);
    }
    
    // If by chance it's already solved, toggle one
    if (newGrid.every(row => row.every(cell => !cell))) {
      newGrid = toggleCells(newGrid, 0, 0, size);
    }
    
    setGrid(newGrid);
  }, []);

  const toggleCells = (currentGrid: boolean[][], r: number, c: number, size: number) => {
    const nextGrid = currentGrid.map(row => [...row]);
    
    const toggle = (row: number, col: number) => {
      if (row >= 0 && row < size && col >= 0 && col < size) {
        nextGrid[row][col] = !nextGrid[row][col];
      }
    };

    toggle(r, c);       // Center
    toggle(r - 1, c);   // Top
    toggle(r + 1, c);   // Bottom
    toggle(r, c - 1);   // Left
    toggle(r, c + 1);   // Right

    return nextGrid;
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setMoves(0);
    setGameState('playing');
    generateGrid(3);
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameState !== 'playing') return;

    const newGrid = toggleCells(grid, r, c, gridSize);
    setGrid(newGrid);
    setMoves(m => m + 1);

    // Check win condition (all lights out)
    const isWin = newGrid.every(row => row.every(cell => !cell));
    if (isWin) {
      const levelScore = Math.max(1000 - (moves * 10), 100) * level;
      setScore(s => s + levelScore);
      setLevel(l => l + 1);
      setMoves(0);
      generateGrid(Math.min(3 + Math.floor(level / 3), 5));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-lg">Smart Grid</span>
        </div>
        <div className="w-10">
          {gameState === 'playing' && (
            <button onClick={() => {
              setGameState('gameover');
              if (onGameComplete) onGameComplete(score, level);
            }} className="text-xs text-white/50 hover:text-white">End</button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-3xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-8">
                <Grid className="w-12 h-12 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Smart Grid</h2>
              <p className="text-white/60 mb-12">Turn off all the lights. Clicking a cell toggles it and its adjacent neighbors.</p>
              <button onClick={startGame} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md flex flex-col items-center">
              <div className="flex justify-between w-full mb-8 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Level</span>
                  <span className="text-2xl font-bold text-cyan-400">{level}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Moves</span>
                  <span className="text-2xl font-bold">{moves}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Score</span>
                  <span className="text-2xl font-bold">{score}</span>
                </div>
              </div>

              <div className="bg-[#1a1a1c] p-4 rounded-3xl border border-white/5">
                <div 
                  className="grid gap-2" 
                  style={{ 
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                    width: `${gridSize * 4}rem`,
                    height: `${gridSize * 4}rem`
                  }}
                >
                  {grid.map((row, r) => 
                    row.map((isOn, c) => (
                      <motion.button
                        key={`${r}-${c}`}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCellClick(r, c)}
                        className={`rounded-xl transition-colors duration-300 ${
                          isOn 
                            ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                            : 'bg-white/5 border border-white/10'
                        }`}
                      />
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
              <p className="text-white/60 mb-8">You reached Level {level}</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5">
                <span className="text-white/50 text-sm font-bold uppercase tracking-wider block mb-2">Final Score</span>
                <span className="text-5xl font-bold text-cyan-400">{score}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                  <RotateCcw className="w-5 h-5" /> Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
