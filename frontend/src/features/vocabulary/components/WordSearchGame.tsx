import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, Search, Grid } from 'lucide-react';
import { motion } from 'motion/react';

interface WordSearchGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
  gameType?: 'find' | 'grid';
}

const WORDS = ['REACT', 'CODE', 'WEB', 'APP', 'DATA', 'TECH', 'CLOUD', 'API', 'UI', 'UX', 'HTML', 'CSS', 'JS'];

export default function WordSearchGame({ onBack, onGameComplete, gameType = 'find', difficulty = 'easy' }: WordSearchGameProps) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [grid, setGrid] = useState<{char: string, isTarget: boolean, isFound: boolean}[]>([]);
  const [targetWord, setTargetWord] = useState('');
  const [gridSize, setGridSize] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const generateGrid = () => {
    const size = Math.min(5 + Math.floor(level / 3), 10);
    setGridSize(size);
    
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(word);
    
    const newGrid = Array(size * size).fill(null).map(() => ({
      char: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      isTarget: false,
      isFound: false
    }));
    
    // Place word horizontally or vertically
    const isHorizontal = Math.random() > 0.5;
    
    let startRow, startCol;
    if (isHorizontal) {
      startRow = Math.floor(Math.random() * size);
      startCol = Math.floor(Math.random() * (size - word.length + 1));
      for (let i = 0; i < word.length; i++) {
        const index = startRow * size + startCol + i;
        newGrid[index] = { char: word[i], isTarget: true, isFound: false };
      }
    } else {
      startRow = Math.floor(Math.random() * (size - word.length + 1));
      startCol = Math.floor(Math.random() * size);
      for (let i = 0; i < word.length; i++) {
        const index = (startRow + i) * size + startCol;
        newGrid[index] = { char: word[i], isTarget: true, isFound: false };
      }
    }
    
    setGrid(newGrid);
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setGameState('playing');
    generateGrid();
  };

  const endGame = () => {
    setGameState('gameover');
    if (onGameComplete) {
      onGameComplete(score, level);
    }
  };

  const handleCellClick = (index: number) => {
    if (gameState !== 'playing') return;
    
    const cell = grid[index];
    if (cell.isFound) return;
    
    if (cell.isTarget) {
      const newGrid = [...grid];
      newGrid[index].isFound = true;
      setGrid(newGrid);
      
      // Check if word is fully found
      const targetCells = newGrid.filter(c => c.isTarget);
      if (targetCells.every(c => c.isFound)) {
        setScore(prev => prev + targetWord.length * 10);
        setLevel(prev => prev + 1);
        setTimeLeft(prev => prev + 5);
        setTimeout(generateGrid, 500);
      }
    } else {
      // Wrong tap penalty
      setTimeLeft(prev => Math.max(0, prev - 2));
    }
  };

  const getIcon = () => {
    return gameType === 'grid' ? <Grid className="w-6 h-6 text-purple-400" /> : <Search className="w-6 h-6 text-cyan-400" />;
  };

  const getTitle = () => {
    return gameType === 'grid' ? 'Letter Grid Search' : 'Find the Word';
  };

  const getColor = () => {
    return gameType === 'grid' ? 'purple' : 'cyan';
  };

  const colorClass = `text-${getColor()}-400`;
  const bgClass = `bg-${getColor()}-500`;
  const hoverBgClass = `hover:bg-${getColor()}-600`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="p-4 flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <button onClick={onBack} className="p-2 hover:bg-slate-700/50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          {getIcon()}
          <h1 className="text-xl font-bold">{getTitle()}</h1>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState === 'start' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className={`w-20 h-20 bg-${getColor()}-500/20 rounded-full flex items-center justify-center mx-auto mb-6`}>
              {React.cloneElement(getIcon() as React.ReactElement, { className: `w-10 h-10 ${colorClass}` })}
            </div>
            <h2 className="text-2xl font-bold mb-4">{getTitle()}</h2>
            <p className="text-slate-400 mb-8">Find the hidden word in the grid of letters. Tap each letter of the word to select it.</p>
            <button onClick={startGame} className={`w-full py-4 ${bgClass} ${hoverBgClass} text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2`}>
              <Play className="w-6 h-6" /> Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-2xl flex-1 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Score</p>
                <p className={`text-2xl font-bold ${colorClass}`}>{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Find</p>
                <p className="text-2xl font-bold text-white tracking-widest">{targetWord}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Time</p>
                <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</p>
              </div>
            </div>

            <div 
              className="grid gap-2 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
              {grid.map((cell, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center text-xl md:text-2xl font-bold transition-colors ${
                    cell.isFound 
                      ? `bg-${getColor()}-500 text-white shadow-[0_0_15px_rgba(var(--color-${getColor()}-500),0.5)]` 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  whileHover={!cell.isFound ? { scale: 1.05 } : {}}
                  whileTap={!cell.isFound ? { scale: 0.95 } : {}}
                >
                  {cell.char}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className={`w-20 h-20 bg-${getColor()}-500/20 rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Trophy className={`w-10 h-10 ${colorClass}`} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
            <p className="text-slate-400 mb-6">You reached level {level}</p>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-8">
              <p className="text-sm text-slate-400 mb-1">Final Score</p>
              <p className={`text-4xl font-bold ${colorClass}`}>{score}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={onBack} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">Menu</button>
              <button onClick={startGame} className={`flex-1 py-4 ${bgClass} ${hoverBgClass} text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2`}>
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
