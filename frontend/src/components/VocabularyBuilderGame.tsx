import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface VocabularyBuilderGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const VOCABULARY = [
  { word: 'Ephemeral', def: 'Lasting for a very short time', wrong: ['Extremely large or great', 'Showing a lack of courage', 'Difficult to understand'] },
  { word: 'Ubiquitous', def: 'Present, appearing, or found everywhere', wrong: ['Rare and hard to find', 'Having a strong smell', 'Moving very slowly'] },
  { word: 'Pragmatic', def: 'Dealing with things sensibly and realistically', wrong: ['Based on theoretical ideas', 'Showing strong emotion', 'Lacking any clear purpose'] },
  { word: 'Eloquent', def: 'Fluent or persuasive in speaking or writing', wrong: ['Quiet and reserved', 'Clumsy and awkward', 'Angry and aggressive'] },
  { word: 'Lucid', def: 'Expressed clearly; easy to understand', wrong: ['Dark and mysterious', 'Confusing and complex', 'Loud and noisy'] },
  { word: 'Meticulous', def: 'Showing great attention to detail', wrong: ['Careless and sloppy', 'Fast and hurried', 'Lazy and unmotivated'] },
  { word: 'Resilient', def: 'Able to withstand or recover quickly from difficult conditions', wrong: ['Weak and fragile', 'Stubborn and unyielding', 'Sad and depressed'] },
  { word: 'Candid', def: 'Truthful and straightforward; frank', wrong: ['Secretive and hidden', 'Polite and formal', 'Rude and offensive'] },
  { word: 'Obscure', def: 'Not discovered or known about; uncertain', wrong: ['Famous and well-known', 'Bright and shining', 'Heavy and solid'] },
  { word: 'Profound', def: 'Very great or intense; having deep meaning', wrong: ['Shallow and superficial', 'Light and airy', 'Simple and basic'] }
];

export default function VocabularyBuilderGame({ onBack, onGameComplete }: VocabularyBuilderGameProps) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [currentWord, setCurrentWord] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctDef, setCorrectDef] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const generateQuestion = () => {
    const item = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    setCurrentWord(item.word);
    setCorrectDef(item.def);
    
    const opts = [item.def, ...item.wrong].sort(() => Math.random() - 0.5);
    setOptions(opts);
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setGameState('playing');
    generateQuestion();
  };

  const endGame = () => {
    setGameState('gameover');
    if (onGameComplete) {
      onGameComplete(score, level);
    }
  };

  const handleOptionClick = (option: string) => {
    if (option === correctDef) {
      setScore(prev => prev + 20);
      setLevel(prev => prev + 1);
      setTimeLeft(prev => prev + 5); // Bonus time
      generateQuestion();
    } else {
      setTimeLeft(prev => Math.max(0, prev - 10)); // Penalty
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="p-4 flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <button onClick={onBack} className="p-2 hover:bg-slate-700/50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-bold">Vocabulary Builder</h1>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState === 'start' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Vocabulary Builder</h2>
            <p className="text-slate-400 mb-8">Choose the correct definition for the given word. Build your vocabulary!</p>
            <button onClick={startGame} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              <Play className="w-6 h-6" /> Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-2xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-12 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Score</p>
                <p className="text-2xl font-bold text-emerald-400">{score}</p>
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

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="text-4xl md:text-6xl font-bold text-white tracking-widest bg-slate-800 px-8 py-6 rounded-2xl border-2 border-slate-700 text-center w-full">
                {currentWord}
              </div>

              <div className="grid grid-cols-1 gap-4 w-full">
                {options.map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    className="p-4 rounded-xl bg-slate-800 border-2 border-slate-700 text-lg md:text-xl font-medium text-slate-300 hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
            <p className="text-slate-400 mb-6">You reached level {level}</p>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-8">
              <p className="text-sm text-slate-400 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-emerald-400">{score}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={onBack} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">Menu</button>
              <button onClick={startGame} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
