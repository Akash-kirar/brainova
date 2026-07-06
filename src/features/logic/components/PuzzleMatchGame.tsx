import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Puzzle } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface PuzzleMatchGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

interface Card {
  id: number;
  text: string;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const LOGICAL_PAIRS = [
  { a: "5 + 3", b: "8" },
  { a: "12 / 4", b: "3" },
  { a: "7 * 6", b: "42" },
  { a: "100 - 45", b: "55" },
  { a: "Square", b: "4 Sides" },
  { a: "Triangle", b: "3 Sides" },
  { a: "Hexagon", b: "6 Sides" },
  { a: "Octagon", b: "8 Sides" },
  { a: "Hot", b: "Cold" },
  { a: "Fast", b: "Slow" },
  { a: "Up", b: "Down" },
  { a: "Left", b: "Right" },
  { a: "Sun", b: "Day" },
  { a: "Moon", b: "Night" },
  { a: "Fire", b: "Heat" },
  { a: "Ice", b: "Cold" },
];

export default function PuzzleMatchGame({ onBack, onGameComplete, difficulty = 'easy' }: PuzzleMatchGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [moves, setMoves] = useState(0);

  const generateCards = useCallback((lvl: number) => {
    const pairCount = Math.min(4 + Math.floor(lvl / 2), 12);
    
    // Select random pairs
    const shuffledPairs = [...LOGICAL_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);
    
    const newCards: Card[] = [];
    shuffledPairs.forEach((pair, index) => {
      newCards.push({ id: index * 2, text: pair.a, pairId: index, isFlipped: false, isMatched: false });
      newCards.push({ id: index * 2 + 1, text: pair.b, pairId: index, isFlipped: false, isMatched: false });
    });
    
    setCards(newCards.sort(() => Math.random() - 0.5));
    setFlippedIds([]);
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setMoves(0);
    setGameState('playing');
    generateCards(1);
  };

  const handleCardClick = (id: number) => {
    if (gameState !== 'playing') return;
    if (flippedIds.length === 2) return;
    
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    const newFlippedIds = [...flippedIds, id];
    setFlippedIds(newFlippedIds);
    
    setCards(cards.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    if (newFlippedIds.length === 2) {
      setMoves(m => m + 1);
      const card1 = cards.find(c => c.id === newFlippedIds[0])!;
      const card2 = cards.find(c => c.id === newFlippedIds[1])!;

      if (card1.pairId === card2.pairId) {
        // Match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === card1.id || c.id === card2.id 
              ? { ...c, isMatched: true } 
              : c
          ));
          setFlippedIds([]);
          setScore(s => s + 50);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === card1.id || c.id === card2.id 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedIds([]);
          setScore(s => Math.max(0, s - 10));
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && cards.length > 0 && cards.every(c => c.isMatched)) {
      setTimeout(() => {
        setLevel(l => l + 1);
        generateCards(level + 1);
      }, 1000);
    }
  }, [cards, gameState, level, generateCards]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-lg">Puzzle Match</span>
        </div>
        <div className="w-10">
          {gameState === 'playing' && (
            <button onClick={() => {
              setGameState('gameover');
              if (onGameComplete) onGameComplete(score, level);
            }} className="text-xs text-white/50 hover:text-white">End</button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                <Puzzle className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Puzzle Match</h2>
              <p className="text-white/60 mb-12">Match logical pairs together. Find the relationship between the cards.</p>
              <button onClick={startGame} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-2xl flex flex-col items-center">
              <div className="flex justify-between w-full mb-8 px-4">
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Level</span>
                  <span className="text-2xl font-bold text-emerald-400">{level}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Moves</span>
                  <span className="text-2xl font-bold">{moves}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Score</span>
                  <span className="text-2xl font-bold">{score}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full">
                {cards.map(card => (
                  <motion.button
                    key={card.id}
                    whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                    whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                    onClick={() => handleCardClick(card.id)}
                    className={`aspect-[4/3] rounded-xl flex items-center justify-center text-center p-2 font-bold transition-all duration-300 ${
                      card.isMatched 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 opacity-50' 
                        : card.isFlipped
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'bg-[#1a1a1c] border border-white/5 text-transparent hover:bg-[#2a2a2c]'
                    }`}
                  >
                    {(card.isFlipped || card.isMatched) && card.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-emerald-400" />
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
