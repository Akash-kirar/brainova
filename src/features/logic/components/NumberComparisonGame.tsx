import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Calculator, Heart } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface NumberComparisonGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

export default function NumberComparisonGame({ onBack, onGameComplete, difficulty = 'easy' }: NumberComparisonGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [lives, setLives] = useState(3);
  
  const [leftExpr, setLeftExpr] = useState<{ text: string; val: number } | null>(null);
  const [rightExpr, setRightExpr] = useState<{ text: string; val: number } | null>(null);

  const generateExpression = (lvl: number) => {
    const type = Math.floor(Math.random() * Math.min(3, Math.ceil(lvl / 3)));
    const maxNum = Math.min(10 + lvl * 5, 100);
    
    if (type === 0) {
      const val = Math.floor(Math.random() * maxNum) + 1;
      return { text: val.toString(), val };
    } else if (type === 1) {
      const a = Math.floor(Math.random() * maxNum) + 1;
      const b = Math.floor(Math.random() * maxNum) + 1;
      return { text: `${a} + ${b}`, val: a + b };
    } else {
      const maxMult = Math.min(5 + Math.floor(lvl / 2), 20);
      const a = Math.floor(Math.random() * maxMult) + 1;
      const b = Math.floor(Math.random() * maxMult) + 1;
      return { text: `${a} × ${b}`, val: a * b };
    }
  };

  const generateRound = useCallback((lvl: number) => {
    let left = generateExpression(lvl);
    let right = generateExpression(lvl);
    
    while (left.val === right.val) {
      right = generateExpression(lvl);
    }
    
    setLeftExpr(left);
    setRightExpr(right);
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
    if (lives > 1) {
      generateRound(level);
    } else {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(score, level);
    }
  };

  const handleOptionClick = (choice: 'left' | 'right') => {
    if (gameState !== 'playing' || !leftExpr || !rightExpr) return;

    const isLeftLarger = leftExpr.val > rightExpr.val;
    const isCorrect = (choice === 'left' && isLeftLarger) || (choice === 'right' && !isLeftLarger);

    if (isCorrect) {
      setScore(s => s + 10 * level);
      setLevel(l => l + 1);
      generateRound(level + 1);
    } else {
      handleWrong();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-lg">Number Comparison</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-3xl bg-amber-500/20 flex items-center justify-center mx-auto mb-8">
                <Calculator className="w-12 h-12 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Number Comparison</h2>
              <p className="text-white/60 mb-12">Quickly select the expression with the larger value.</p>
              <button onClick={startGame} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && leftExpr && rightExpr && (
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

              <p className="text-white/50 text-sm text-center mb-6">Which is larger?</p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOptionClick('left')}
                  className="bg-[#1a1a1c] border border-white/5 hover:bg-white/10 p-8 rounded-3xl flex items-center justify-center transition-colors text-3xl font-bold h-48"
                >
                  {leftExpr.text}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOptionClick('right')}
                  className="bg-[#1a1a1c] border border-white/5 hover:bg-white/10 p-8 rounded-3xl flex items-center justify-center transition-colors text-3xl font-bold h-48"
                >
                  {rightExpr.text}
                </motion.button>
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
