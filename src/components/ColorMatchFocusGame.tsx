import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Trophy, Target, Zap } from 'lucide-react';

type GameState = 'menu' | 'playing' | 'gameover';

interface ColorMatchFocusGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const COLORS = [
  { name: 'RED', value: 'text-rose-500' },
  { name: 'BLUE', value: 'text-blue-500' },
  { name: 'GREEN', value: 'text-emerald-500' },
  { name: 'YELLOW', value: 'text-amber-500' },
  { name: 'PURPLE', value: 'text-purple-500' },
  { name: 'ORANGE', value: 'text-orange-500' }
];

export default function ColorMatchFocusGame({ onBack, onGameComplete }: ColorMatchFocusGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  
  const [word, setWord] = useState(COLORS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [isMatch, setIsMatch] = useState(true);

  const generateRound = useCallback(() => {
    const match = Math.random() > 0.5;
    setIsMatch(match);

    const randomWord = COLORS[Math.floor(Math.random() * COLORS.length)];
    setWord(randomWord);

    if (match) {
      setColor(randomWord);
    } else {
      let randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      while (randomColor.name === randomWord.name) {
        randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      setColor(randomColor);
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setLevel(1);
    setCombo(0);
    setGameState('playing');
    generateRound();
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      setGameState('gameover');
      if (onGameComplete) onGameComplete(score, level);
    }
  }, [gameState, timeLeft, score, level, onGameComplete]);

  const handleAnswer = (answer: boolean) => {
    if (gameState !== 'playing') return;

    if (answer === isMatch) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(s => s + 10 * Math.min(newCombo, 5));
      
      if (newCombo % 10 === 0) {
        setLevel(l => l + 1);
        setTimeLeft(t => t + 5); // Bonus time
      }
    } else {
      setCombo(0);
      setScore(s => Math.max(0, s - 20));
      setTimeLeft(t => Math.max(0, t - 2)); // Penalty
    }
    
    generateRound();
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-lg">Color Match</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 rounded-3xl bg-amber-500/20 flex items-center justify-center mx-auto mb-8">
                <Target className="w-12 h-12 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Color Match</h2>
              <p className="text-white/60 mb-12 max-w-xs mx-auto">Does the meaning of the word match its ink color? Ignore the word, focus on the color!</p>
              <button onClick={startGame} className="w-full max-w-sm bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <div className="flex justify-between items-center px-6 py-4 bg-[#1a1a1c] border-b border-white/5">
                <div className="flex flex-col">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Time</span>
                  <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Combo</span>
                  <span className="text-2xl font-bold text-amber-400">x{combo}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Score</span>
                  <span className="text-2xl font-bold">{score}</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <p className="text-white/50 mb-8 text-center">Does the word match the color?</p>
                
                <motion.div
                  key={`${word.name}-${color.value}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-6xl font-black tracking-widest mb-16 ${color.value}`}
                  style={{ textShadow: '0 0 40px currentColor' }}
                >
                  {word.name}
                </motion.div>

                <div className="flex gap-4 w-full max-w-sm">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/50 font-bold py-6 rounded-2xl transition-colors text-xl"
                  >
                    NO
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 font-bold py-6 rounded-2xl transition-colors text-xl"
                  >
                    YES
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
              <p className="text-white/60 mb-8">You reached Level {level}</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5 w-full max-w-sm">
                <span className="text-white/50 text-sm font-bold uppercase tracking-wider block mb-2">Final Score</span>
                <span className="text-5xl font-bold text-amber-400">{score}</span>
              </div>
              <div className="flex gap-4 w-full max-w-sm">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
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
