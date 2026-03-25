import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Search, Heart } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface HiddenPatternPuzzleGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const SHAPES = ['circle', 'square', 'triangle', 'diamond'];
const COLORS = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];

export default function HiddenPatternPuzzleGame({ onBack, onGameComplete }: HiddenPatternPuzzleGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  
  const [matrix, setMatrix] = useState<{ shape: string; color: string }[]>([]);
  const [options, setOptions] = useState<{ shape: string; color: string }[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<{ shape: string; color: string } | null>(null);

  const generateMatrix = useCallback((lvl: number) => {
    // 3x3 matrix logic
    // Rule types:
    // 0: Shape constant in row, color constant in col
    // 1: Color constant in row, shape constant in col
    // 2: Shape shifts right, color shifts down
    
    const ruleType = Math.floor(Math.random() * 3);
    const selectedShapes = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, 3);
    const selectedColors = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 3);
    
    const newMatrix: { shape: string; color: string }[] = [];
    
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let shape = '';
        let color = '';
        
        if (ruleType === 0) {
          shape = selectedShapes[r];
          color = selectedColors[c];
        } else if (ruleType === 1) {
          shape = selectedShapes[c];
          color = selectedColors[r];
        } else {
          shape = selectedShapes[(r + c) % 3];
          color = selectedColors[(r + c * 2) % 3];
        }
        
        newMatrix.push({ shape, color });
      }
    }
    
    // The last element (index 8) is the answer
    const answer = newMatrix[8];
    setCorrectAnswer(answer);
    
    // Generate options
    const newOptions = [answer];
    while (newOptions.length < 4) {
      const randomOption = {
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };
      
      const isDuplicate = newOptions.some(o => o.shape === randomOption.shape && o.color === randomOption.color);
      if (!isDuplicate) {
        newOptions.push(randomOption);
      }
    }
    
    setMatrix(newMatrix);
    setOptions(newOptions.sort(() => Math.random() - 0.5));
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameState('playing');
    generateMatrix(1);
  };

  const handleWrong = () => {
    setLives(l => l - 1);
    if (lives > 1) {
      generateMatrix(level);
    } else {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(score, level);
    }
  };

  const handleOptionClick = (option: { shape: string; color: string }) => {
    if (gameState !== 'playing' || !correctAnswer) return;

    if (option.shape === correctAnswer.shape && option.color === correctAnswer.color) {
      setScore(s => s + 20 * level);
      setLevel(l => l + 1);
      generateMatrix(level + 1);
    } else {
      handleWrong();
    }
  };

  const renderShape = (shape: string, color: string) => {
    const baseClasses = `w-10 h-10 ${color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`;
    
    switch (shape) {
      case 'circle': return <div className={`${baseClasses} rounded-full`} />;
      case 'square': return <div className={`${baseClasses} rounded-xl`} />;
      case 'triangle': return <div className={`w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent ${color.replace('bg-', 'border-b-')} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`} />;
      case 'diamond': return <div className={`${baseClasses} rotate-45 rounded-md`} />;
      default: return <div className={`${baseClasses} rounded-full`} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-lg">Hidden Pattern</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-3xl bg-amber-500/20 flex items-center justify-center mx-auto mb-8">
                <Search className="w-12 h-12 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Hidden Pattern</h2>
              <p className="text-white/60 mb-12">Deduce the logical rules of the 3x3 matrix to find the missing piece.</p>
              <button onClick={startGame} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md flex flex-col items-center">
              <div className="flex justify-between w-full mb-8 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Level</span>
                  <span className="text-2xl font-bold text-amber-400">{level}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Score</span>
                  <span className="text-2xl font-bold">{score}</span>
                </div>
              </div>

              <div className="flex gap-1 mb-8">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className={`w-6 h-6 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-white/20'}`} />
                ))}
              </div>

              <div className="bg-[#1a1a1c] p-6 rounded-3xl border border-white/5 mb-8 w-full">
                <div className="grid grid-cols-3 gap-4 mx-auto w-fit">
                  {matrix.map((item, index) => (
                    <div key={index} className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                      {index === 8 ? (
                        <span className="text-3xl text-white/20 font-bold">?</span>
                      ) : (
                        renderShape(item.shape, item.color)
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 w-full">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOptionClick(option)}
                    className="bg-[#1a1a1c] border border-white/5 hover:bg-white/10 p-4 rounded-2xl flex items-center justify-center transition-colors aspect-square"
                  >
                    {renderShape(option.shape, option.color)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-rose-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
              <p className="text-white/60 mb-8">You reached Level {level}</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5">
                <span className="text-white/50 text-sm font-bold uppercase tracking-wider block mb-2">Final Score</span>
                <span className="text-5xl font-bold text-amber-400">{score}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
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
