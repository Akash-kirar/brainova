import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Calculator } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface MathSprintGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
  title: string;
  description: string;
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

export default function MathSprintGame({ operation, title, description, onBack, onGameComplete, difficulty = 'easy' }: MathSprintGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [equation, setEquation] = useState<{ a: number; b: number; op: string; answer: number } | null>(null);
  const [options, setOptions] = useState<number[]>([]);

  const generateEquation = useCallback((lvl: number) => {
    let op = operation;
    if (op === 'mixed') {
      const ops = ['addition', 'subtraction', 'multiplication', 'division'];
      op = ops[Math.floor(Math.random() * ops.length)] as any;
    }

    let a = 0;
    let b = 0;
    let ans = 0;
    let opSymbol = '';

    const maxNum = Math.min(10 + lvl * 5, 100);

    if (op === 'addition') {
      a = Math.floor(Math.random() * maxNum) + 1;
      b = Math.floor(Math.random() * maxNum) + 1;
      ans = a + b;
      opSymbol = '+';
    } else if (op === 'subtraction') {
      a = Math.floor(Math.random() * maxNum) + 1;
      b = Math.floor(Math.random() * a) + 1; // Ensure positive result
      ans = a - b;
      opSymbol = '-';
    } else if (op === 'multiplication') {
      const maxMult = Math.min(5 + Math.floor(lvl / 2), 20);
      a = Math.floor(Math.random() * maxMult) + 1;
      b = Math.floor(Math.random() * maxMult) + 1;
      ans = a * b;
      opSymbol = '×';
    } else if (op === 'division') {
      const maxDiv = Math.min(5 + Math.floor(lvl / 2), 20);
      b = Math.floor(Math.random() * maxDiv) + 1;
      ans = Math.floor(Math.random() * maxDiv) + 1;
      a = b * ans;
      opSymbol = '÷';
    }

    setEquation({ a, b, op: opSymbol, answer: ans });

    // Generate options
    const newOptions = [ans];
    while (newOptions.length < 4) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const fake = ans + offset;
      if (!newOptions.includes(fake) && fake >= 0) {
        newOptions.push(fake);
      }
    }
    setOptions(newOptions.sort(() => Math.random() - 0.5));
  }, [operation]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setGameState('playing');
    generateEquation(1);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(score, level);
    }
  }, [gameState, timeLeft, score, level, onGameComplete]);

  const handleOptionClick = (opt: number) => {
    if (gameState !== 'playing' || !equation) return;

    if (opt === equation.answer) {
      setScore(s => s + 10 * level);
      setLevel(l => l + 1);
      generateEquation(level + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 5)); // Penalty
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-lg">{title}</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-3xl bg-blue-500/20 flex items-center justify-center mx-auto mb-8">
                <Calculator className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              <p className="text-white/60 mb-12">{description}</p>
              <button onClick={startGame} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && equation && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md flex flex-col items-center">
              <div className="flex justify-between w-full mb-8 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Level</span>
                  <span className="text-2xl font-bold text-blue-400">{level}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Time</span>
                  <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Score</span>
                  <span className="text-2xl font-bold">{score}</span>
                </div>
              </div>

              <div className="bg-[#1a1a1c] p-8 rounded-3xl border border-white/5 mb-8 w-full flex items-center justify-center">
                <span className="text-5xl font-bold tracking-widest">
                  {equation.a} {equation.op} {equation.b} = ?
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {options.map((opt, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOptionClick(opt)}
                    className="bg-[#1a1a1c] border border-white/5 hover:bg-white/10 p-6 rounded-2xl flex items-center justify-center transition-colors text-3xl font-bold"
                  >
                    {opt}
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
              <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
              <p className="text-white/60 mb-8">You reached Level {level}</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5">
                <span className="text-white/50 text-sm font-bold uppercase tracking-wider block mb-2">Final Score</span>
                <span className="text-5xl font-bold text-blue-400">{score}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
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
