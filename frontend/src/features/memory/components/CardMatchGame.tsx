import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Heart, Play, RotateCcw, Trophy, Brain } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface CardMatchGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const ICONS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🥝', '🍍', '🥥', '🥑', '🍆', '🥕'];

export default function CardMatchGame({ onBack, onGameComplete, difficulty = 'easy' }: CardMatchGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [cards, setCards] = useState<{ id: number; icon: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const getLevelSettings = (lvl: number) => {
    const pairsCount = Math.min(3 + Math.floor(lvl / 2), ICONS.length);
    return { pairsCount, playTime: 30 + lvl * 5 };
  };

  const generateCards = useCallback((lvl: number) => {
    const settings = getLevelSettings(lvl);
    const selectedIcons = [...ICONS].sort(() => 0.5 - Math.random()).slice(0, settings.pairsCount);
    const deck = [...selectedIcons, ...selectedIcons]
      .sort(() => 0.5 - Math.random())
      .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }));
    
    setCards(deck);
    setFlippedIndices([]);
    setIsChecking(false);
    setTimeLeft(settings.playTime);
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameState('playing');
    generateCards(1);
  };

  const nextLevel = useCallback(() => {
    setLevel(l => l + 1);
    generateCards(level + 1);
  }, [level, generateCards]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setLives(l => l - 1);
      if (lives > 1) {
        generateCards(level);
      } else {
        setGameState('gameover');
        if (onGameComplete) onGameComplete(score, level);
      }
    }
  }, [gameState, timeLeft, lives, level, score, generateCards, onGameComplete]);

  const handleCardClick = (index: number) => {
    if (gameState !== 'playing' || isChecking || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = newFlipped;
      if (newCards[firstIndex].icon === newCards[secondIndex].icon) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setIsChecking(false);
          setScore(s => s + 10 * level);

          if (matchedCards.every(c => c.isMatched)) {
            setTimeout(nextLevel, 500);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsChecking(false);
          setScore(s => Math.max(0, s - 2));
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
          <span className="font-bold text-lg">Card Match</span>
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
              <h2 className="text-3xl font-bold mb-4">Card Match</h2>
              <p className="text-white/60 mb-12">Find all matching pairs before time runs out.</p>
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
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Time</span>
                  <div className="flex items-center gap-1 text-rose-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-2xl font-bold">{timeLeft}s</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-8">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className={`w-6 h-6 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-white/20'}`} />
                ))}
              </div>

              <div className="grid grid-cols-4 gap-3 w-full max-w-[300px]">
                {cards.map((card, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-colors ${
                      card.isFlipped || card.isMatched ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/10 border-white/20'
                    } border-2`}
                  >
                    {(card.isFlipped || card.isMatched) ? card.icon : ''}
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
