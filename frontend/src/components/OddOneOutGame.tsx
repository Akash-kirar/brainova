import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {  ArrowLeft, Heart, Play, RotateCcw, Trophy, Target  } from 'lucide-react';
import GameMenu from './GameMenu';

type GameState = 'menu' | 'playing' | 'gameover';

interface OddOneOutGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const SHAPES = ['circle', 'square', 'triangle', 'hexagon'];
const COLORS = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];

export default function OddOneOutGame({ onBack, onGameComplete }: OddOneOutGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [items, setItems] = useState<{ id: number; shape: string; color: string; isOdd: boolean }[]>([]);

  const generateLevel = useCallback((lvl: number) => {
    const itemCount = Math.min(4 + Math.floor(lvl / 2), 24);
    
    // Pick base shape and color
    const baseShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    // Pick odd property (shape or color)
    const isOddShape = Math.random() > 0.5;
    
    let oddShape = baseShape;
    let oddColor = baseColor;
    
    if (isOddShape) {
      const otherShapes = SHAPES.filter(s => s !== baseShape);
      oddShape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
    } else {
      const otherColors = COLORS.filter(c => c !== baseColor);
      oddColor = otherColors[Math.floor(Math.random() * otherColors.length)];
    }
    
    const oddIndex = Math.floor(Math.random() * itemCount);
    
    const newItems = Array.from({ length: itemCount }).map((_, i) => {
      if (i === oddIndex) {
        return { id: i, shape: oddShape, color: oddColor, isOdd: true };
      }
      return { id: i, shape: baseShape, color: baseColor, isOdd: false };
    });
    
    setItems(newItems);
    setTimeLeft(Math.max(3, 10 - Math.floor(lvl / 3)));
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameState('playing');
    generateLevel(1);
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
      generateLevel(level);
    } else {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(score, level);
    }
  };

  const handleItemClick = (isOdd: boolean) => {
    if (gameState !== 'playing') return;

    if (isOdd) {
      setScore(s => s + 10 * level + timeLeft * 5);
      setLevel(l => l + 1);
      generateLevel(level + 1);
    } else {
      handleWrong();
    }
  };

  const renderShape = (shape: string, color: string) => {
    const baseClasses = `w-12 h-12 ${color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`;
    switch (shape) {
      case 'circle': return <div className={`${baseClasses} rounded-full`} />;
      case 'square': return <div className={`${baseClasses} rounded-xl`} />;
      case 'triangle': return <div className={`w-0 h-0 border-l-[24px] border-r-[24px] border-b-[42px] border-l-transparent border-r-transparent ${color.replace('bg-', 'border-b-')} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`} />;
      case 'hexagon': return <div className={`${baseClasses}" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}`}><div className={`w-full h-full ${color}`} style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} /></div>;
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
          <Target className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-lg">Odd One Out</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <GameMenu
              title="Odd One Out"
              description="Find the shape or color that doesn't belong as fast as you can."
              icon={<Target className="w-14 h-14 text-indigo-400" />}
              iconBgColor="bg-indigo-500/20"
              iconColor="text-indigo-400"
              onStart={startGame}
              onBack={onBack}
              showDifficulty={false}
            />
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

              <div className="flex flex-wrap justify-center gap-4 w-full max-w-[350px]">
                {items.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleItemClick(item.isOdd)}
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    {renderShape(item.shape, item.color)}
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
