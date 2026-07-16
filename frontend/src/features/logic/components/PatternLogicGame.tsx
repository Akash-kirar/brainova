import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Brain, Heart } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface PatternLogicGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const SHAPES = ['circle', 'square', 'triangle', 'diamond'];
const COLORS = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];

export default function PatternLogicGame({ onBack, onGameComplete, difficulty = 'easy' }: PatternLogicGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const [sequence, setSequence] = useState<{ shape: string; color: string }[]>([]);
  const [options, setOptions] = useState<{ shape: string; color: string }[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<{ shape: string; color: string } | null>(null);

  const generatePattern = useCallback((lvl: number) => {
    // Pattern types:
    // 1. ABAB
    // 2. AABB
    // 3. ABCABC
    // 4. ABACABAC
    const patternType = Math.floor(Math.random() * Math.min(4, Math.ceil(lvl / 3)));
    
    const elements = [];
    for (let i = 0; i < 3; i++) {
      elements.push({
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }

    let fullSequence: { shape: string; color: string }[] = [];
    
    if (patternType === 0) {
      // ABAB
      fullSequence = [elements[0], elements[1], elements[0], elements[1], elements[0]];
    } else if (patternType === 1) {
      // AABB
      fullSequence = [elements[0], elements[0], elements[1], elements[1], elements[0], elements[0]];
    } else if (patternType === 2) {
      // ABCABC
      fullSequence = [elements[0], elements[1], elements[2], elements[0], elements[1], elements[2], elements[0]];
    } else {
      // ABACABAC
      fullSequence = [elements[0], elements[1], elements[0], elements[2], elements[0], elements[1], elements[0], elements[2], elements[0]];
    }

    // The last element is the answer
    const answer = fullSequence.pop()!;
    setSequence(fullSequence);
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
    
    // Shuffle options
    setOptions(newOptions.sort(() => Math.random() - 0.5));
    setTimeLeft(Math.max(5, 15 - Math.floor(lvl / 2)));
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameState('playing');
    generatePattern(1);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      handleWrong();
    }
  }, [gameState, timeLeft]);

  const handleWrong = () => {
    setLives(l => l - 1);
    if (lives > 1) {
      generatePattern(level);
    } else {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(score, level);
    }
  };

  const handleOptionClick = (option: { shape: string; color: string }) => {
    if (gameState !== 'playing' || !correctAnswer) return;

    if (option.shape === correctAnswer.shape && option.color === correctAnswer.color) {
      setScore(s => s + 10 * level + timeLeft * 5);
      setLevel(l => l + 1);
      generatePattern(level + 1);
    } else {
      handleWrong();
    }
  };

  const renderShape = (shape: string, color: string, isSmall = false) => {
    const size = isSmall ? 'w-8 h-8' : 'w-12 h-12';
    const baseClasses = `${size} ${color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`;
    
    switch (shape) {
      case 'circle': return <div className={`${baseClasses} rounded-full`} />;
      case 'square': return <div className={`${baseClasses} rounded-xl`} />;
      case 'triangle': return <div className={`w-0 h-0 border-l-[${isSmall ? '16px' : '24px'}] border-r-[${isSmall ? '16px' : '24px'}] border-b-[${isSmall ? '28px' : '42px'}] border-l-transparent border-r-transparent ${color.replace('bg-', 'border-b-')} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`} />;
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
          <Brain className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-lg">Pattern Logic</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-3xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-8">
                <Brain className="w-12 h-12 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Pattern Logic</h2>
              <p className="text-white/60 mb-12">Observe the sequence and select the shape that comes next.</p>
              <button onClick={startGame} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md flex flex-col items-center">
              <div className="flex justify-between w-full mb-8 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Level</span>
                  <span className="text-2xl font-bold text-indigo-400">{level}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Time</span>
                  <span className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
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
                <p className="text-white/50 text-sm text-center mb-6">What comes next?</p>
                <div className="flex flex-wrap justify-center items-center gap-4">
                  {sequence.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      {renderShape(item.shape, item.color, true)}
                      <span className="text-white/20 font-bold">→</span>
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center text-white/20 font-bold">?</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOptionClick(option)}
                    className="bg-[#1a1a1c] border border-white/5 hover:bg-white/5 p-6 rounded-2xl flex items-center justify-center transition-colors h-32"
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
