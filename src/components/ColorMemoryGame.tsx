import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {  ArrowLeft, Heart, Play, RotateCcw, Trophy, Brain  } from 'lucide-react';
import GameMenu from './GameMenu';

type GameState = 'menu' | 'showing' | 'inputting' | 'gameover';

interface ColorMemoryGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500',
  'bg-cyan-500'
];

export default function ColorMemoryGame({ onBack, onGameComplete }: ColorMemoryGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIndex, setShowIndex] = useState(-1);

  const generateSequence = useCallback((lvl: number) => {
    const length = 2 + Math.floor(lvl / 2);
    const newSeq = Array.from({ length }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
    setSequence(newSeq);
    setCurrentIndex(0);
    setShowIndex(0);
    setGameState('showing');
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    generateSequence(1);
  };

  useEffect(() => {
    if (gameState === 'showing') {
      if (showIndex < sequence.length) {
        const timer = setTimeout(() => {
          setShowIndex(showIndex + 1);
        }, 800);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setGameState('inputting');
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, showIndex, sequence.length]);

  const handleColorClick = (color: string) => {
    if (gameState !== 'inputting') return;

    const expectedColor = sequence[currentIndex];
    if (color === expectedColor) {
      setCurrentIndex(currentIndex + 1);
      setScore(s => s + 10);

      if (currentIndex + 1 === sequence.length) {
        setTimeout(() => {
          setLevel(l => l + 1);
          generateSequence(level + 1);
        }, 1000);
      }
    } else {
      setLives(l => l - 1);
      if (lives > 1) {
        setTimeout(() => {
          generateSequence(level);
        }, 1000);
      } else {
        setGameState('gameover');
        if (onGameComplete) onGameComplete(score, level);
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
          <Brain className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-lg">Color Memory</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <GameMenu
              title="Color Memory"
              description="Remember the sequence of colors and repeat it."
              icon={<Brain className="w-14 h-14 text-indigo-400" />}
              iconBgColor="bg-indigo-500/20"
              iconColor="text-indigo-400"
              onStart={startGame}
              onBack={onBack}
              showDifficulty={false}
            />
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

              <div className="h-40 flex items-center justify-center mb-8 w-full">
                {gameState === 'showing' ? (
                  <AnimatePresence mode="wait">
                    {showIndex < sequence.length && (
                      <motion.div
                        key={showIndex}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className={`w-32 h-32 rounded-full ${sequence[showIndex]} shadow-[0_0_40px_rgba(255,255,255,0.2)]`}
                      />
                    )}
                  </AnimatePresence>
                ) : (
                  <div className="flex gap-2 flex-wrap justify-center">
                    {sequence.map((_, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full ${i < currentIndex ? sequence[i] : 'bg-white/10'}`} />
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-[300px]">
                {COLORS.map((color, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleColorClick(color)}
                    disabled={gameState !== 'inputting'}
                    className={`aspect-square rounded-2xl transition-colors ${color} ${
                      gameState === 'inputting' ? 'opacity-100 hover:brightness-110' : 'opacity-50'
                    }`}
                  />
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
