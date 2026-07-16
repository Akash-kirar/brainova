import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

interface MemoryUpdaterGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function MemoryUpdaterGame({ onBack, onGameComplete, difficulty }: MemoryUpdaterGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'showing' | 'updating' | 'guessing' | 'gameover'>('showing');
  
  const [boxes, setBoxes] = useState<{id: number, value: number, trueValue: number}[]>([]);
  const [updates, setUpdates] = useState<{boxIndex: number, delta: number}[]>([]);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const [targetBox, setTargetBox] = useState<number>(0);
  const [options, setOptions] = useState<number[]>([]);

  useEffect(() => {
    generateLevel();
  }, [level]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState !== 'gameover' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState !== 'gameover') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const generateLevel = () => {
    const boxCount = Math.min(2 + Math.floor(level / 3), 4);
    const updateCount = Math.min(2 + Math.floor(level / 2), 6);
    
    let newBoxes = [];
    for (let i = 0; i < boxCount; i++) {
      const val = Math.floor(Math.random() * 5) + 1;
      newBoxes.push({ id: i, value: val, trueValue: val });
    }
    
    let newUpdates = [];
    for (let i = 0; i < updateCount; i++) {
      const bIndex = Math.floor(Math.random() * boxCount);
      const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const finalDelta = delta === 0 ? 1 : delta;
      newUpdates.push({ boxIndex: bIndex, delta: finalDelta });
      newBoxes[bIndex].trueValue += finalDelta;
    }
    
    setBoxes(newBoxes);
    setUpdates(newUpdates);
    setCurrentUpdateIndex(0);
    setGameState('showing');
    
    setTimeout(() => {
      setGameState('updating');
    }, 2500);
  };

  useEffect(() => {
    if (gameState === 'updating') {
      if (currentUpdateIndex < updates.length) {
        const timer = setTimeout(() => {
          setCurrentUpdateIndex(c => c + 1);
        }, Math.max(1000, 2000 - level * 100));
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          prepareGuess();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, currentUpdateIndex, updates.length, level]);

  const prepareGuess = () => {
    const tBox = Math.floor(Math.random() * boxes.length);
    setTargetBox(tBox);
    
    const trueAns = boxes[tBox].trueValue;
    let opts = new Set<number>();
    opts.add(trueAns);
    while (opts.size < 4) {
      opts.add(trueAns + Math.floor(Math.random() * 7) - 3);
    }
    
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setGameState('guessing');
  };

  const handleGuess = (val: number) => {
    if (gameState !== 'guessing') return;
    
    if (val === boxes[targetBox].trueValue) {
      setScore(s => s + 20 * level);
      setLevel(l => l + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 5));
      setTimeout(() => generateLevel(), 500);
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
        {gameState === 'gameover' ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-8">Score: {score}</p>
          </div>
        ) : (
          <div className="w-full max-w-md flex flex-col items-center gap-8">
            <h2 className="text-2xl font-bold text-center">
              {gameState === 'showing' && "Memorize"}
              {gameState === 'updating' && "Apply updates mentally"}
              {gameState === 'guessing' && "What is the final value?"}
            </h2>
            
            <div className="flex gap-4 w-full justify-center">
              {boxes.map((box, i) => (
                <div 
                  key={box.id}
                  className={`w-20 h-24 rounded-2xl flex flex-col items-center justify-center text-3xl font-bold transition-all ${
                    gameState === 'guessing' && targetBox === i 
                      ? 'bg-blue-500/30 border-2 border-blue-400 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]'
                      : 'bg-[#1a1a1c] border border-white/5 text-white'
                  }`}
                >
                  <div className="text-xs text-white/30 uppercase tracking-widest mb-1">Box {String.fromCharCode(65 + i)}</div>
                  {gameState === 'showing' ? box.value : '?'}
                </div>
              ))}
            </div>
            
            <div className="h-24 flex items-center justify-center w-full">
              {gameState === 'updating' && currentUpdateIndex < updates.length && (
                <motion.div
                  key={currentUpdateIndex}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="bg-white/10 px-8 py-4 rounded-3xl text-3xl font-bold tracking-wider"
                >
                  Box {String.fromCharCode(65 + updates[currentUpdateIndex].boxIndex)}
                  <span className={`ml-4 ${updates[currentUpdateIndex].delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {updates[currentUpdateIndex].delta > 0 ? '+' : ''}{updates[currentUpdateIndex].delta}
                  </span>
                </motion.div>
              )}
              
              {gameState === 'guessing' && (
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  {options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleGuess(opt)}
                      className="py-4 bg-blue-500/20 text-blue-300 rounded-xl font-bold text-2xl hover:bg-blue-500/30 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
