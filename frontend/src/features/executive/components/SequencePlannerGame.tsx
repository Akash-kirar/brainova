import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

interface SequencePlannerGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function SequencePlannerGame({ onBack, onGameComplete, difficulty }: SequencePlannerGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [grid, setGrid] = useState<{id: string, label: string, type: 'number'|'letter'}[]>([]);
  const [expectedNext, setExpectedNext] = useState<{type: 'number'|'letter', index: number}>({type: 'number', index: 1});

  useEffect(() => {
    generateLevel();
  }, [level]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const generateLevel = () => {
    const pairCount = Math.min(3 + level, 8); // 3 pairs (1,A, 2,B, 3,C) = 6 items
    const items = [];
    
    for (let i = 1; i <= pairCount; i++) {
      items.push({ id: `n${i}`, label: i.toString(), type: 'number' as const });
      items.push({ id: `l${i}`, label: LETTERS[i - 1], type: 'letter' as const });
    }
    
    setGrid(items.sort(() => Math.random() - 0.5));
    setExpectedNext({ type: 'number', index: 1 });
  };

  const handleTileClick = (item: {id: string, label: string, type: 'number'|'letter'}) => {
    if (gameState !== 'playing') return;
    
    // Check if it's correct
    const expectedLabel = expectedNext.type === 'number' ? expectedNext.index.toString() : LETTERS[expectedNext.index - 1];
    
    if (item.label === expectedLabel) {
      // Correct!
      setScore(s => s + 5 * level);
      
      const newGrid = grid.filter(i => i.id !== item.id);
      setGrid(newGrid);
      
      if (newGrid.length === 0) {
        setLevel(l => l + 1);
      } else {
        if (expectedNext.type === 'number') {
          setExpectedNext({ type: 'letter', index: expectedNext.index });
        } else {
          setExpectedNext({ type: 'number', index: expectedNext.index + 1 });
        }
      }
    } else {
      // Incorrect
      setTimeLeft(t => Math.max(0, t - 5));
    }
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-lg">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-lg">{timeLeft}s</span>
          </div>
          <div className="font-bold text-lg text-white/50">Lvl {level}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {gameState === 'playing' ? (
          <div className="w-full max-w-md flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Alternate 1-A-2-B...</h2>
              <div className="text-white/50 font-medium">
                Next: <span className="text-white font-bold">{expectedNext.type === 'number' ? expectedNext.index : LETTERS[expectedNext.index - 1]}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full justify-center mt-4">
              <AnimatePresence>
                {grid.map(item => (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTileClick(item)}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ${
                      item.type === 'number' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-8">Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
