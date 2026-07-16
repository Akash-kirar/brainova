import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, Type } from 'lucide-react';
import { motion } from 'motion/react';

interface WordBuilderGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
  gameType?: 'builder' | 'scramble' | 'puzzle';
}

const WORD_LISTS = {
  builder: ['CAT', 'DOG', 'BIRD', 'FISH', 'BEAR', 'LION', 'TIGER', 'ZEBRA', 'MONKEY', 'ELEPHANT'],
  scramble: ['REACT', 'TYPESCRIPT', 'JAVASCRIPT', 'PYTHON', 'HTML', 'CSS', 'NODE', 'GRAPHQL', 'DOCKER', 'LINUX'],
  puzzle: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'MANGO', 'PEACH', 'CHERRY', 'LEMON', 'MELON', 'BERRY']
};

export default function WordBuilderGame({ onBack, onGameComplete, gameType = 'builder' }: WordBuilderGameProps) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{char: string, index: number}[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const generateWord = () => {
    const list = WORD_LISTS[gameType];
    const word = list[Math.min(level - 1, list.length - 1)];
    setCurrentWord(word);
    
    // Scramble letters
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    setScrambledLetters(letters);
    setSelectedLetters([]);
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setGameState('playing');
    generateWord();
  };

  const endGame = () => {
    setGameState('gameover');
    if (onGameComplete) {
      onGameComplete(score, level);
    }
  };

  const handleLetterClick = (char: string, index: number) => {
    if (selectedLetters.some(l => l.index === index)) return;
    
    const newSelected = [...selectedLetters, { char, index }];
    setSelectedLetters(newSelected);
    
    if (newSelected.length === currentWord.length) {
      const formedWord = newSelected.map(l => l.char).join('');
      if (formedWord === currentWord) {
        setScore(prev => prev + currentWord.length * 10);
        setLevel(prev => prev + 1);
        setTimeLeft(prev => prev + 5); // Bonus time
        setTimeout(generateWord, 500);
      } else {
        // Wrong word, reset selection
        setTimeout(() => setSelectedLetters([]), 500);
      }
    }
  };

  const handleRemoveLetter = (selectedIndex: number) => {
    setSelectedLetters(prev => prev.filter((_, i) => i !== selectedIndex));
  };

  const getTitle = () => {
    switch (gameType) {
      case 'scramble': return 'Word Scramble';
      case 'puzzle': return 'Word Puzzle';
      default: return 'Word Builder';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="p-4 flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <button onClick={onBack} className="p-2 hover:bg-slate-700/50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Type className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-bold">{getTitle()}</h1>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState === 'start' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Type className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">{getTitle()}</h2>
            <p className="text-slate-400 mb-8">Unscramble the letters to build the correct word before time runs out!</p>
            <button onClick={startGame} className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              <Play className="w-6 h-6" /> Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-2xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Score</p>
                <p className="text-2xl font-bold text-indigo-400">{score}</p>
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

            <div className="flex-1 flex flex-col items-center justify-center gap-12">
              {/* Selected Letters */}
              <div className="flex flex-wrap justify-center gap-2 min-h-[4rem]">
                {Array.from({ length: currentWord.length }).map((_, i) => {
                  const selected = selectedLetters[i];
                  return (
                    <motion.button
                      key={`slot-${i}`}
                      onClick={() => selected && handleRemoveLetter(i)}
                      className={`w-12 h-16 md:w-16 md:h-20 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold border-2 transition-colors ${
                        selected 
                          ? 'bg-indigo-500/20 border-indigo-400 text-white cursor-pointer hover:bg-indigo-500/30' 
                          : 'bg-slate-800 border-slate-700 text-transparent'
                      }`}
                      whileHover={selected ? { scale: 1.05 } : {}}
                      whileTap={selected ? { scale: 0.95 } : {}}
                    >
                      {selected?.char || ''}
                    </motion.button>
                  );
                })}
              </div>

              {/* Available Letters */}
              <div className="flex flex-wrap justify-center gap-3">
                {scrambledLetters.map((char, index) => {
                  const isSelected = selectedLetters.some(l => l.index === index);
                  return (
                    <motion.button
                      key={`letter-${index}`}
                      onClick={() => handleLetterClick(char, index)}
                      disabled={isSelected}
                      className={`w-12 h-16 md:w-16 md:h-20 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold border-2 transition-all ${
                        isSelected 
                          ? 'bg-slate-800 border-slate-700 text-slate-600 opacity-50 cursor-not-allowed' 
                          : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500 shadow-lg cursor-pointer'
                      }`}
                      whileHover={!isSelected ? { scale: 1.05, y: -2 } : {}}
                      whileTap={!isSelected ? { scale: 0.95 } : {}}
                    >
                      {char}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
            <p className="text-slate-400 mb-6">You reached level {level}</p>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-8">
              <p className="text-sm text-slate-400 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-indigo-400">{score}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={onBack} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">Menu</button>
              <button onClick={startGame} className="flex-1 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
