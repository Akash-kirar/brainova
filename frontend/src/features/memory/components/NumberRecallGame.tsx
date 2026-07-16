import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, Play, RotateCcw, Trophy, Brain } from 'lucide-react';

type GameState = 'menu' | 'showing' | 'inputting' | 'gameover';

interface NumberRecallGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

export default function NumberRecallGame({ onBack, onGameComplete, difficulty = 'easy' }: NumberRecallGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [lives, setLives] = useState(3);
  
  const [targetNumber, setTargetNumber] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [showTime, setShowTime] = useState(2000);

  const generateNumber = useCallback((lvl: number) => {
    const length = 2 + Math.floor(lvl / 2);
    let numStr = '';
    for (let i = 0; i < length; i++) {
      numStr += Math.floor(Math.random() * 10).toString();
    }
    setTargetNumber(numStr);
    setUserInput('');
    setShowTime(Math.max(500, 2000 - lvl * 100));
    setGameState('showing');
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    generateNumber(1);
  };

  useEffect(() => {
    if (gameState === 'showing') {
      const timer = setTimeout(() => {
        setGameState('inputting');
      }, showTime);
      return () => clearTimeout(timer);
    }
  }, [gameState, showTime]);

  const handleNumberClick = (num: number) => {
    if (gameState !== 'inputting') return;

    const newUserInput = userInput + num.toString();
    setUserInput(newUserInput);

    if (newUserInput.length === targetNumber.length) {
      if (newUserInput === targetNumber) {
        setScore(s => s + 10 * level);
        setTimeout(() => {
          setLevel(l => l + 1);
          generateNumber(level + 1);
        }, 1000);
      } else {
        setLives(l => l - 1);
        if (lives > 1) {
          setTimeout(() => {
            generateNumber(level);
          }, 1000);
        } else {
          setTimeout(() => {
            setGameState('gameover');
            if (onGameComplete) onGameComplete(score, level);
          }, 1000);
        }
      }
    }
  };

  const handleDelete = () => {
    if (gameState !== 'inputting' || userInput.length === 0) return;
    setUserInput(userInput.slice(0, -1));
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-lg">Number Recall</span>
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
              <h2 className="text-3xl font-bold mb-4">Number Recall</h2>
              <p className="text-white/60 mb-12">Memorize the number shown quickly and type it back.</p>
              <button onClick={startGame} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {(gameState === 'showing' || gameState === 'inputting') && (
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

              <div className="h-32 flex items-center justify-center mb-8 w-full">
                {gameState === 'showing' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    className="text-6xl font-bold tracking-widest text-indigo-400"
                  >
                    {targetNumber}
                  </motion.div>
                ) : (
                  <div className="text-5xl font-bold tracking-widest text-white">
                    {userInput || <span className="text-white/20">?</span>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-[300px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNumberClick(num)}
                    disabled={gameState !== 'inputting'}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-bold transition-colors ${
                      gameState === 'inputting' ? 'bg-white/10 hover:bg-white/20 border border-white/20' : 'bg-white/5 text-white/20 border border-white/5'
                    }`}
                  >
                    {num}
                  </motion.button>
                ))}
                <div className="aspect-square" />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNumberClick(0)}
                  disabled={gameState !== 'inputting'}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-bold transition-colors ${
                    gameState === 'inputting' ? 'bg-white/10 hover:bg-white/20 border border-white/20' : 'bg-white/5 text-white/20 border border-white/5'
                  }`}
                >
                  0
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={gameState !== 'inputting'}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-xl font-bold transition-colors ${
                    gameState === 'inputting' ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/20' : 'bg-white/5 text-white/20 border border-white/5'
                  }`}
                >
                  DEL
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
