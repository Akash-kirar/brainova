import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Grid } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface SlidingPuzzleGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

export default function SlidingPuzzleGame({ onBack, onGameComplete, difficulty = 'easy' }: SlidingPuzzleGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  
  const gridSize = 3;

  const getSolvableBoard = useCallback(() => {
    const board = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let emptyIdx = 8;
    
    // Shuffle by making 100 random valid moves
    for (let i = 0; i < 100; i++) {
      const validMoves = [];
      const row = Math.floor(emptyIdx / gridSize);
      const col = emptyIdx % gridSize;
      
      if (row > 0) validMoves.push(emptyIdx - gridSize);
      if (row < gridSize - 1) validMoves.push(emptyIdx + gridSize);
      if (col > 0) validMoves.push(emptyIdx - 1);
      if (col < gridSize - 1) validMoves.push(emptyIdx + 1);
      
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      
      [board[emptyIdx], board[randomMove]] = [board[randomMove], board[emptyIdx]];
      emptyIdx = randomMove;
    }
    return board;
  }, []);

  const startGame = () => {
    setTiles(getSolvableBoard());
    setMoves(0);
    setTime(0);
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing') return;
    
    const emptyIdx = tiles.indexOf(0);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIdx / gridSize);
    const emptyCol = emptyIdx % gridSize;
    
    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
    
    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);
      
      // Check win
      const isWin = newTiles.every((val, i) => {
        if (i === newTiles.length - 1) return val === 0;
        return val === i + 1;
      });
      
      if (isWin) {
        // Base score 1000, minus 5 per second, minus 10 per move
        const finalScore = Math.max(1000 - (time * 5) - (moves * 10), 100);
        setScore(finalScore);
        setGameState('gameover');
        if (onGameComplete) onGameComplete(finalScore, 1);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-lg">Sliding Puzzle</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-3xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-8">
                <Grid className="w-12 h-12 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Sliding Puzzle</h2>
              <p className="text-white/60 mb-12">Slide the tiles to arrange them in numerical order from 1 to 8.</p>
              <button onClick={startGame} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md flex flex-col items-center">
              <div className="flex justify-between w-full mb-8 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Moves</span>
                  <span className="text-2xl font-bold text-indigo-400">{moves}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Time</span>
                  <span className="text-2xl font-bold">{time}s</span>
                </div>
              </div>

              <div className="bg-[#1a1a1c] p-4 rounded-3xl border border-white/5">
                <div className="grid grid-cols-3 gap-2 w-64 h-64">
                  {tiles.map((tile, index) => (
                    <motion.button
                      key={`${index}-${tile}`}
                      layout
                      initial={false}
                      onClick={() => handleTileClick(index)}
                      className={`rounded-xl flex items-center justify-center text-2xl font-bold transition-colors ${
                        tile === 0 
                          ? 'bg-transparent' 
                          : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-100 border border-indigo-500/30'
                      }`}
                      disabled={tile === 0}
                    >
                      {tile !== 0 && tile}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Puzzle Solved!</h2>
              <p className="text-white/60 mb-8">Moves: {moves} | Time: {time}s</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5">
                <span className="text-white/50 text-sm font-bold uppercase tracking-wider block mb-2">Final Score</span>
                <span className="text-5xl font-bold text-indigo-400">{score}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
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
