import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {  ArrowLeft, Heart, Play, RotateCcw, Trophy, Brain  } from 'lucide-react';
import GameMenu from './GameMenu';

type GameState = 'menu' | 'showing' | 'inputting' | 'gameover';

interface PatternRecallGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

export default function PatternRecallGame({ onBack, onGameComplete }: PatternRecallGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  
  const [pattern, setPattern] = useState<number[]>([]);
  const [showIndex, setShowIndex] = useState(-1);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [isError, setIsError] = useState(false);

  const generatePattern = useCallback((lvl: number) => {
    const length = 3 + Math.floor(lvl / 2);
    const newPattern: number[] = [];
    let current = Math.floor(Math.random() * 9);
    newPattern.push(current);
    
    for (let i = 1; i < length; i++) {
      const neighbors = getNeighbors(current);
      const validNeighbors = neighbors.filter(n => !newPattern.includes(n));
      if (validNeighbors.length === 0) break;
      current = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
      newPattern.push(current);
    }
    
    setPattern(newPattern);
    setUserPattern([]);
    setShowIndex(0);
    setIsError(false);
    setGameState('showing');
  }, []);

  const getNeighbors = (index: number) => {
    const neighbors = [];
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    for (let r = Math.max(0, row - 1); r <= Math.min(2, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(2, col + 1); c++) {
        if (r !== row || c !== col) {
          neighbors.push(r * 3 + c);
        }
      }
    }
    return neighbors;
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    generatePattern(1);
  };

  useEffect(() => {
    if (gameState === 'showing') {
      if (showIndex < pattern.length) {
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
  }, [gameState, showIndex, pattern.length]);

  const handleNodeClick = (index: number) => {
    if (gameState !== 'inputting' || isError) return;
    if (userPattern.includes(index)) return;

    const expectedIndex = pattern[userPattern.length];
    if (index === expectedIndex) {
      const newUserPattern = [...userPattern, index];
      setUserPattern(newUserPattern);
      setScore(s => s + 10);

      if (newUserPattern.length === pattern.length) {
        setTimeout(() => {
          setLevel(l => l + 1);
          generatePattern(level + 1);
        }, 1000);
      }
    } else {
      setIsError(true);
      setLives(l => l - 1);
      if (lives > 1) {
        setTimeout(() => {
          generatePattern(level);
        }, 1000);
      } else {
        setTimeout(() => {
          setGameState('gameover');
          if (onGameComplete) onGameComplete(score, level);
        }, 1000);
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
          <span className="font-bold text-lg">Pattern Recall</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <GameMenu
              title="Pattern Recall"
              description="Remember the path and recreate it."
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

              <div className="relative w-full max-w-[300px] aspect-square">
                <div className="absolute inset-0 grid grid-cols-3 gap-4">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                    const isShowing = gameState === 'showing' && showIndex >= 0 && index === pattern[showIndex];
                    const isSelected = gameState === 'inputting' && userPattern.includes(index);
                    const isWrong = isError && index === pattern[userPattern.length];
                    
                    return (
                      <motion.button
                        key={index}
                        whileHover={gameState === 'inputting' && !userPattern.includes(index) ? { scale: 1.1 } : {}}
                        whileTap={gameState === 'inputting' && !userPattern.includes(index) ? { scale: 0.9 } : {}}
                        onClick={() => handleNodeClick(index)}
                        className={`rounded-full flex items-center justify-center transition-colors relative ${
                          isShowing ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]' :
                          isSelected ? 'bg-indigo-500' :
                          isWrong ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]' :
                          'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {(isShowing || isSelected || isWrong) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 bg-white rounded-full"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
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
