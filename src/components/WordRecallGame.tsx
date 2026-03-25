import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Heart, Play, RotateCcw, Trophy, Brain } from 'lucide-react';

type GameState = 'menu' | 'showing' | 'inputting' | 'gameover';

interface WordRecallGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const ALL_WORDS = [
  'APPLE', 'HOUSE', 'CHAIR', 'WATER', 'LIGHT', 'PAPER', 'MUSIC', 'RIVER',
  'STONE', 'TRAIN', 'CLOCK', 'BREAD', 'GLASS', 'PLANT', 'SMILE', 'DREAM',
  'OCEAN', 'NIGHT', 'STORM', 'HEART', 'SPACE', 'EARTH', 'FIRE', 'CLOUD',
  'BIRD', 'TIGER', 'SNAKE', 'EAGLE', 'SHARK', 'WHALE', 'BEAR', 'WOLF'
];

export default function WordRecallGame({ onBack, onGameComplete }: WordRecallGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [wrongWords, setWrongWords] = useState<string[]>([]);

  const getLevelSettings = (lvl: number) => {
    const targetCount = Math.min(3 + Math.floor(lvl / 2), 12);
    const optionsCount = Math.min(targetCount * 2, 24);
    return { targetCount, optionsCount, showTime: Math.max(3000, 6000 - lvl * 300) };
  };

  const generateWords = useCallback((lvl: number) => {
    const settings = getLevelSettings(lvl);
    
    const shuffledAll = [...ALL_WORDS].sort(() => 0.5 - Math.random());
    const targets = shuffledAll.slice(0, settings.targetCount);
    const distractors = shuffledAll.slice(settings.targetCount, settings.optionsCount);
    
    const allOptions = [...targets, ...distractors].sort(() => 0.5 - Math.random());
    
    setTargetWords(targets);
    setOptions(allOptions);
    setSelectedWords([]);
    setWrongWords([]);
    setGameState('showing');
    setTimeLeft(settings.showTime / 1000);
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    generateWords(1);
  };

  useEffect(() => {
    if (gameState === 'showing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'showing' && timeLeft <= 0) {
      setGameState('inputting');
    }
  }, [gameState, timeLeft]);

  const handleWordClick = (word: string) => {
    if (gameState !== 'inputting') return;
    if (selectedWords.includes(word) || wrongWords.includes(word)) return;

    if (targetWords.includes(word)) {
      const newSelected = [...selectedWords, word];
      setSelectedWords(newSelected);
      setScore(s => s + 10);

      if (newSelected.length === targetWords.length) {
        setTimeout(() => {
          setLevel(l => l + 1);
          generateWords(level + 1);
        }, 1000);
      }
    } else {
      const newWrong = [...wrongWords, word];
      setWrongWords(newWrong);
      setLives(l => l - 1);
      
      if (lives > 1) {
        // Continue playing but with one less life
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
          <span className="font-bold text-lg">Word Recall</span>
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
              <h2 className="text-3xl font-bold mb-4">Word Recall</h2>
              <p className="text-white/60 mb-12">Memorize the words and find them among distractors.</p>
              <button onClick={startGame} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
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
                {gameState === 'showing' && (
                  <div className="flex flex-col items-center">
                    <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Time</span>
                    <div className="flex items-center gap-1 text-rose-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-2xl font-bold">{timeLeft}s</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-1 mb-8">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className={`w-6 h-6 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-white/20'}`} />
                ))}
              </div>

              {gameState === 'showing' ? (
                <div className="flex flex-wrap justify-center gap-3 w-full max-w-[350px]">
                  {targetWords.map((word, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/10 rounded-xl px-4 py-2 font-bold text-lg tracking-wider"
                    >
                      {word}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-3 w-full max-w-[350px]">
                  {options.map((word, i) => {
                    const isSelected = selectedWords.includes(word);
                    const isWrong = wrongWords.includes(word);
                    
                    return (
                      <motion.button
                        key={i}
                        whileHover={!isSelected && !isWrong ? { scale: 1.05 } : {}}
                        whileTap={!isSelected && !isWrong ? { scale: 0.95 } : {}}
                        onClick={() => handleWordClick(word)}
                        className={`rounded-xl px-4 py-2 font-bold text-sm tracking-wider transition-colors border-2 ${
                          isSelected ? 'bg-indigo-500/20 border-indigo-500/50 opacity-50' :
                          isWrong ? 'bg-rose-500/20 border-rose-500/50 opacity-50' :
                          'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {word}
                      </motion.button>
                    );
                  })}
                </div>
              )}
              
              {gameState === 'inputting' && (
                <p className="mt-8 text-white/60 text-center">
                  Find the {targetWords.length} words you just saw.<br/>
                  Found: {selectedWords.length} / {targetWords.length}
                </p>
              )}
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
