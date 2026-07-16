import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {  ArrowLeft, Play, RotateCcw, Trophy, Box, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight  } from 'lucide-react';
import GameMenu from './GameMenu';

type GameState = 'menu' | 'playing' | 'gameover';

interface CubeRotationPuzzleGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const COLORS = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];

export default function CubeRotationPuzzleGame({ onBack, onGameComplete }: CubeRotationPuzzleGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [grid, setGrid] = useState<string[][]>([]);
  const [targetGrid, setTargetGrid] = useState<string[][]>([]);
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  
  const gridSize = 3;

  const generateLevel = useCallback((lvl: number) => {
    // Create a solved grid
    const solved = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(null).map(() => COLORS[Math.floor(Math.random() * COLORS.length)])
    );
    
    setTargetGrid(solved);
    
    // Shuffle it
    let current = solved.map(row => [...row]);
    const shuffleMoves = Math.min(3 + lvl, 15);
    
    for (let i = 0; i < shuffleMoves; i++) {
      const isRow = Math.random() > 0.5;
      const index = Math.floor(Math.random() * gridSize);
      const dir = Math.random() > 0.5 ? 1 : -1;
      
      if (isRow) {
        const newRow = [...current[index]];
        if (dir === 1) {
          newRow.unshift(newRow.pop()!);
        } else {
          newRow.push(newRow.shift()!);
        }
        current[index] = newRow;
      } else {
        const col = current.map(row => row[index]);
        if (dir === 1) {
          col.unshift(col.pop()!);
        } else {
          col.push(col.shift()!);
        }
        for (let r = 0; r < gridSize; r++) {
          current[r][index] = col[r];
        }
      }
    }
    
    setGrid(current);
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setMoves(0);
    setGameState('playing');
    generateLevel(1);
  };

  const shiftRow = (rowIndex: number, dir: 1 | -1) => {
    if (gameState !== 'playing') return;
    
    const newGrid = grid.map(row => [...row]);
    const row = newGrid[rowIndex];
    
    if (dir === 1) {
      row.unshift(row.pop()!);
    } else {
      row.push(row.shift()!);
    }
    
    setGrid(newGrid);
    setMoves(m => m + 1);
    checkWin(newGrid);
  };

  const shiftCol = (colIndex: number, dir: 1 | -1) => {
    if (gameState !== 'playing') return;
    
    const newGrid = grid.map(row => [...row]);
    const col = newGrid.map(row => row[colIndex]);
    
    if (dir === 1) {
      col.unshift(col.pop()!);
    } else {
      col.push(col.shift()!);
    }
    
    for (let r = 0; r < gridSize; r++) {
      newGrid[r][colIndex] = col[r];
    }
    
    setGrid(newGrid);
    setMoves(m => m + 1);
    checkWin(newGrid);
  };

  const checkWin = (currentGrid: string[][]) => {
    const isWin = currentGrid.every((row, r) => 
      row.every((cell, c) => cell === targetGrid[r][c])
    );
    
    if (isWin) {
      const levelScore = Math.max(1000 - (moves * 10), 100) * level;
      setScore(s => s + levelScore);
      setLevel(l => l + 1);
      setMoves(0);
      generateLevel(level + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-purple-400" />
          <span className="font-bold text-lg">Cube Rotation</span>
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
            <GameMenu
              title="Cube Rotation"
              description="Shift rows and columns to match the target pattern."
              icon={<Box className="w-14 h-14 text-purple-400" />}
              iconBgColor="bg-purple-500/20"
              iconColor="text-purple-400"
              onStart={startGame}
              onBack={onBack}
              showDifficulty={false}
            />
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md flex flex-col items-center">
              <div className="flex justify-between w-full mb-8 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Level</span>
                  <span className="text-2xl font-bold text-purple-400">{level}</span>
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

              <div className="flex flex-col items-center gap-8 w-full">
                {/* Target Grid */}
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-sm mb-2">Target</span>
                  <div className="grid grid-cols-3 gap-1 p-2 bg-white/5 rounded-xl">
                    {targetGrid.map((row, r) => 
                      row.map((color, c) => (
                        <div key={`target-${r}-${c}`} className={`w-6 h-6 rounded-sm ${color}`} />
                      ))
                    )}
                  </div>
                </div>

                {/* Play Grid */}
                <div className="relative p-8">
                  {/* Top Arrows */}
                  <div className="absolute top-0 left-8 right-8 flex justify-around">
                    {[0, 1, 2].map(c => (
                      <button key={`up-${c}`} onClick={() => shiftCol(c, -1)} className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                  
                  {/* Bottom Arrows */}
                  <div className="absolute bottom-0 left-8 right-8 flex justify-around">
                    {[0, 1, 2].map(c => (
                      <button key={`down-${c}`} onClick={() => shiftCol(c, 1)} className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white">
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    ))}
                  </div>

                  {/* Left Arrows */}
                  <div className="absolute left-0 top-8 bottom-8 flex flex-col justify-around">
                    {[0, 1, 2].map(r => (
                      <button key={`left-${r}`} onClick={() => shiftRow(r, -1)} className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white">
                        <ArrowLeftIcon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>

                  {/* Right Arrows */}
                  <div className="absolute right-0 top-8 bottom-8 flex flex-col justify-around">
                    {[0, 1, 2].map(r => (
                      <button key={`right-${r}`} onClick={() => shiftRow(r, 1)} className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-[#1a1a1c] p-2 rounded-2xl border border-white/10">
                    {grid.map((row, r) => 
                      row.map((color, c) => (
                        <motion.div 
                          key={`cell-${r}-${c}`} 
                          layout
                          className={`w-16 h-16 rounded-xl ${color} shadow-inner`} 
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
              <p className="text-white/60 mb-8">You reached Level {level}</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5">
                <span className="text-white/50 text-sm font-bold uppercase tracking-wider block mb-2">Final Score</span>
                <span className="text-5xl font-bold text-purple-400">{score}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
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
