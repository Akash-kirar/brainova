import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Calculator, Heart } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface EquationBuilderGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

export default function EquationBuilderGame({ onBack, onGameComplete, difficulty = 'easy' }: EquationBuilderGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [lives, setLives] = useState(3);
  
  const [target, setTarget] = useState<number>(0);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const generateRound = useCallback((lvl: number) => {
    const numCount = Math.min(3 + Math.floor(lvl / 3), 6);
    const maxNum = Math.min(10 + lvl * 2, 50);
    
    // Generate random numbers
    const newNumbers = Array(numCount).fill(0).map(() => Math.floor(Math.random() * maxNum) + 1);
    
    // Pick 2 or 3 random numbers to form the target
    const targetCount = Math.min(2 + Math.floor(Math.random() * 2), numCount);
    const targetIndices = [...Array(numCount).keys()].sort(() => Math.random() - 0.5).slice(0, targetCount);
    
    let newTarget = 0;
    targetIndices.forEach(idx => {
      newTarget += newNumbers[idx];
    });
    
    setNumbers(newNumbers);
    setTarget(newTarget);
    setSelectedIndices([]);
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameState('playing');
    generateRound(1);
  };

  const handleWrong = () => {
    setLives(l => l - 1);
    setSelectedIndices([]);
    if (lives > 1) {
      // Keep same round
    } else {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(score, level);
    }
  };

  const handleNumberClick = (index: number) => {
    if (gameState !== 'playing') return;

    let newSelected = [...selectedIndices];
    if (newSelected.includes(index)) {
      newSelected = newSelected.filter(i => i !== index);
    } else {
      newSelected.push(index);
    }
    
    setSelectedIndices(newSelected);
    
    // Check sum
    const currentSum = newSelected.reduce((acc, idx) => acc + numbers[idx], 0);
    
    if (currentSum === target) {
      setTimeout(() => {
        setScore(s => s + 10 * level);
        setLevel(l => l + 1);
        generateRound(level + 1);
      }, 500);
    } else if (currentSum > target) {
      setTimeout(() => {
        handleWrong();
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-lg">Equation Builder</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                <Calculator className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Equation Builder</h2>
              <p className="text-white/60 mb-12">Select numbers that add up exactly to the target number.</p>
              <button onClick={startGame} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md flex flex-col items-center">
              <div className="flex justify-between w-full mb-8 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Level</span>
                  <span className="text-2xl font-bold text-emerald-400">{level}</span>
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

              <div className="bg-[#1a1a1c] p-8 rounded-3xl border border-white/5 mb-8 w-full flex flex-col items-center justify-center">
                <span className="text-white/50 text-sm mb-2">Target</span>
                <span className="text-6xl font-bold text-emerald-400">{target}</span>
                
                <div className="mt-8 text-2xl font-bold h-8 flex items-center gap-2">
                  {selectedIndices.length > 0 ? (
                    <>
                      {selectedIndices.map((idx, i) => (
                        <React.Fragment key={idx}>
                          {i > 0 && <span className="text-white/30">+</span>}
                          <span>{numbers[idx]}</span>
                        </React.Fragment>
                      ))}
                      <span className="text-white/30">=</span>
                      <span className={selectedIndices.reduce((a, i) => a + numbers[i], 0) > target ? 'text-rose-400' : 'text-white'}>
                        {selectedIndices.reduce((a, i) => a + numbers[i], 0)}
                      </span>
                    </>
                  ) : (
                    <span className="text-white/20">Select numbers...</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full">
                {numbers.map((num, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNumberClick(index)}
                    className={`border p-6 rounded-2xl flex items-center justify-center transition-colors text-2xl font-bold ${
                      selectedIndices.includes(index)
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-[#1a1a1c] border-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    {num}
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
                <span className="text-5xl font-bold text-emerald-400">{score}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
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
