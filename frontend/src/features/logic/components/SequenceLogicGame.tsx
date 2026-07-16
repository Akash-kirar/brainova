import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Brain, Heart } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface SequenceLogicGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

export default function SequenceLogicGame({ onBack, onGameComplete, difficulty = 'easy' }: SequenceLogicGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [lives, setLives] = useState(3);
  
  const [sequence, setSequence] = useState<number[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [answer, setAnswer] = useState<number>(0);

  const generateSequence = useCallback((lvl: number) => {
    const type = Math.floor(Math.random() * Math.min(4, Math.ceil(lvl / 2)));
    let seq: number[] = [];
    let nextNum = 0;

    const start = Math.floor(Math.random() * 10) + 1;
    const step = Math.floor(Math.random() * 5) + 1;

    if (type === 0) {
      // Arithmetic
      seq = [start, start + step, start + step * 2, start + step * 3];
      nextNum = start + step * 4;
    } else if (type === 1) {
      // Geometric
      const mult = Math.floor(Math.random() * 2) + 2;
      seq = [start, start * mult, start * mult * 2, start * mult * 3];
      nextNum = start * mult * 4;
    } else if (type === 2) {
      // Fibonacci-like
      let a = start;
      let b = start + step;
      seq = [a, b];
      for (let i = 0; i < 2; i++) {
        const c = a + b;
        seq.push(c);
        a = b;
        b = c;
      }
      nextNum = a + b;
    } else {
      // Alternating
      const step2 = Math.floor(Math.random() * 5) + 1;
      seq = [start, start + step, start + step - step2, start + step * 2 - step2];
      nextNum = start + step * 2 - step2 * 2;
    }

    setSequence(seq);
    setAnswer(nextNum);

    // Generate options
    const opts = [nextNum];
    while (opts.length < 4) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const fake = nextNum + offset;
      if (!opts.includes(fake) && fake !== nextNum) {
        opts.push(fake);
      }
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameState('playing');
    generateSequence(1);
  };

  const handleWrong = () => {
    setLives(l => l - 1);
    if (lives > 1) {
      generateSequence(level);
    } else {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(score, level);
    }
  };

  const handleOptionClick = (opt: number) => {
    if (gameState !== 'playing') return;

    if (opt === answer) {
      setScore(s => s + 10 * level);
      setLevel(l => l + 1);
      generateSequence(level + 1);
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
          <Brain className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-lg">Sequence Logic</span>
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
              <h2 className="text-3xl font-bold mb-4">Sequence Logic</h2>
              <p className="text-white/60 mb-12">Find the logical pattern in the numbers and select the next one.</p>
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
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Score</span>
                  <span className="text-2xl font-bold">{score}</span>
                </div>
              </div>

              <div className="flex gap-1 mb-8">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className={`w-6 h-6 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-white/20'}`} />
                ))}
              </div>

              <div className="bg-[#1a1a1c] p-8 rounded-3xl border border-white/5 mb-8 w-full">
                <p className="text-white/50 text-sm text-center mb-6">What comes next?</p>
                <div className="flex flex-wrap justify-center items-center gap-4 text-2xl font-bold">
                  {sequence.map((num, index) => (
                    <React.Fragment key={index}>
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                        {num}
                      </div>
                      <span className="text-white/20">,</span>
                    </React.Fragment>
                  ))}
                  <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 rounded-xl flex items-center justify-center">
                    ?
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {options.map((opt, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOptionClick(opt)}
                    className="bg-[#1a1a1c] border border-white/5 hover:bg-white/10 p-6 rounded-2xl flex items-center justify-center transition-colors text-2xl font-bold"
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
