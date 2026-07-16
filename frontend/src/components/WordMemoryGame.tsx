import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, Brain } from 'lucide-react';
import { motion } from 'motion/react';

interface WordMemoryGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const WORDS = [
  'APPLE', 'BANANA', 'CHERRY', 'DOG', 'ELEPHANT', 'FROG', 'GRAPE', 'HOUSE', 'IGLOO', 'JUMP',
  'KITE', 'LION', 'MONKEY', 'NIGHT', 'OWL', 'PENGUIN', 'QUEEN', 'RABBIT', 'SNAKE', 'TIGER',
  'UMBRELLA', 'VIOLIN', 'WHALE', 'XYLOPHONE', 'YACHT', 'ZEBRA', 'CAR', 'BOAT', 'TRAIN', 'PLANE'
];

export default function WordMemoryGame({ onBack, onGameComplete }: WordMemoryGameProps) {
  const [gameState, setGameState] = useState<'start' | 'memorize' | 'recall' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'memorize' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'memorize') {
      startRecall();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const generateLevel = () => {
    const numWords = Math.min(2 + Math.floor(level / 2), 8);
    
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, numWords);
    
    setTargetWords(targets);
    setTimeLeft(Math.max(3, numWords * 1.5)); // Time to memorize
    setGameState('memorize');
    setSelectedWords([]);
    
    // Prepare options for recall phase
    const numOptions = Math.min(numWords * 2 + 2, 16);
    const wrongOptions = shuffled.slice(numWords, numOptions);
    setOptions([...targets, ...wrongOptions].sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    generateLevel();
  };

  const startRecall = () => {
    setGameState('recall');
  };

  const endGame = () => {
    setGameState('gameover');
    if (onGameComplete) {
      onGameComplete(score, level);
    }
  };

  const handleWordSelect = (word: string) => {
    if (gameState !== 'recall') return;
    if (selectedWords.includes(word)) return;
    
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);
    
    if (targetWords.includes(word)) {
      // Correct
      setScore(prev => prev + 10);
      
      // Check if all found
      const allFound = targetWords.every(w => newSelected.includes(w));
      if (allFound) {
        setTimeout(() => {
          setLevel(prev => prev + 1);
          generateLevel();
        }, 1000);
      }
    } else {
      // Wrong
      setTimeout(endGame, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="p-4 flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <button onClick={onBack} className="p-2 hover:bg-slate-700/50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-rose-400" />
          <h1 className="text-xl font-bold">Word Memory</h1>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState === 'start' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Word Memory</h2>
            <p className="text-slate-400 mb-8">Memorize the words shown, then select them from a larger list.</p>
            <button onClick={startGame} className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              <Play className="w-6 h-6" /> Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'memorize' && (
          <div className="w-full max-w-2xl flex-1 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Memorize!</h2>
            <p className="text-xl text-rose-400 mb-12">{Math.ceil(timeLeft)}s remaining</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {targetWords.map((word, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-6 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-2xl font-bold text-white"
                >
                  {word}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'recall' && (
          <div className="w-full max-w-3xl flex-1 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Score</p>
                <p className="text-2xl font-bold text-rose-400">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Level</p>
                <p className="text-2xl font-bold text-white">{level}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Found</p>
                <p className="text-2xl font-bold text-white">
                  {selectedWords.filter(w => targetWords.includes(w)).length} / {targetWords.length}
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-8 text-white">Select the words you saw</h2>

            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {options.map((word, i) => {
                const isSelected = selectedWords.includes(word);
                const isCorrect = targetWords.includes(word);
                
                let btnClass = "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600";
                if (isSelected) {
                  if (isCorrect) {
                    btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                  } else {
                    btnClass = "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
                  }
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleWordSelect(word)}
                    disabled={isSelected}
                    className={`px-6 py-3 rounded-xl border-2 text-xl font-bold transition-all ${btnClass}`}
                    whileHover={!isSelected ? { scale: 1.05 } : {}}
                    whileTap={!isSelected ? { scale: 0.95 } : {}}
                  >
                    {word}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-rose-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
            <p className="text-slate-400 mb-6">You reached level {level}</p>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-8">
              <p className="text-sm text-slate-400 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-rose-400">{score}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={onBack} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">Menu</button>
              <button onClick={startGame} className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
