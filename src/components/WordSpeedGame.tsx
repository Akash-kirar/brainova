import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface WordSpeedGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const WORDS = [
  'APPLE', 'BANANA', 'CHERRY', 'DOG', 'ELEPHANT', 'FROG', 'GRAPE', 'HOUSE', 'IGLOO', 'JUMP',
  'KITE', 'LION', 'MONKEY', 'NIGHT', 'OWL', 'PENGUIN', 'QUEEN', 'RABBIT', 'SNAKE', 'TIGER',
  'UMBRELLA', 'VIOLIN', 'WHALE', 'XYLOPHONE', 'YACHT', 'ZEBRA', 'CAR', 'BOAT', 'TRAIN', 'PLANE'
];

export default function WordSpeedGame({ onBack, onGameComplete }: WordSpeedGameProps) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const [targetWord, setTargetWord] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const generateRound = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(word);
    
    const opts = new Set<string>([word]);
    while(opts.size < 4) {
      opts.add(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(30);
    setGameState('playing');
    generateRound();
  };

  const endGame = () => {
    setGameState('gameover');
    if (onGameComplete) {
      onGameComplete(score, level);
    }
  };

  const handleOptionClick = (option: string) => {
    if (option === targetWord) {
      setScore(prev => prev + 10);
      setLevel(prev => prev + 1);
      setTimeLeft(prev => prev + 1); // Small bonus time
      generateRound();
    } else {
      setTimeLeft(prev => Math.max(0, prev - 3)); // Penalty
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="p-4 flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <button onClick={onBack} className="p-2 hover:bg-slate-700/50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-400" />
          <h1 className="text-xl font-bold">Word Speed Test</h1>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState === 'start' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Word Speed Test</h2>
            <p className="text-slate-400 mb-8">Quickly find the matching word. You have 30 seconds, but correct answers give you bonus time!</p>
            <button onClick={startGame} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              <Play className="w-6 h-6" /> Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-2xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-12 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Score</p>
                <p className="text-2xl font-bold text-orange-400">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Level</p>
                <p className="text-2xl font-bold text-white">{level}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Time</p>
                <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-16">
              <div className="text-4xl md:text-6xl font-bold text-white tracking-widest bg-slate-800 px-8 py-6 rounded-2xl border-2 border-slate-700">
                {targetWord}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {options.map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    className="py-6 rounded-xl bg-slate-800 border-2 border-slate-700 text-2xl font-bold text-white hover:bg-slate-700 hover:border-slate-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-orange-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
            <p className="text-slate-400 mb-6">You reached level {level}</p>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-8">
              <p className="text-sm text-slate-400 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-orange-400">{score}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={onBack} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">Menu</button>
              <button onClick={startGame} className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
