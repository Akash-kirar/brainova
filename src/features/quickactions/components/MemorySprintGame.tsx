import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, Clock, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemorySprintGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function MemorySprintGame({ onBack, onGameComplete, difficulty = 'easy' }: MemorySprintGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds for testing
  const [score, setScore] = useState(0);
  const [currentSequence, setCurrentSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(15);
    setScore(0);
    setLevel(1);
    setCombo(0);
    generateSequence(1);
  };

  const generateSequence = (currentLevel: number) => {
    const length = 2 + Math.floor(currentLevel / 2); // Starts at 2, increases every 2 levels
    const seq = [];
    for (let i = 0; i < length; i++) {
      seq.push(Math.floor(Math.random() * 9) + 1); // Numbers 1-9
    }
    setCurrentSequence(seq);
    setUserSequence([]);
    setIsShowingSequence(true);

    // Hide sequence after a delay based on length
    setTimeout(() => {
      setIsShowingSequence(false);
    }, 1000 + length * 400);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      onGameComplete(score, level);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, level, onGameComplete]);

  const handleNumberClick = (num: number) => {
    if (isShowingSequence || gameState !== 'playing') return;

    const newUserSeq = [...userSequence, num];
    setUserSequence(newUserSeq);

    const currentIndex = newUserSeq.length - 1;
    if (newUserSeq[currentIndex] !== currentSequence[currentIndex]) {
      // Mistake
      setCombo(0);
      setScore((prev) => Math.max(0, prev - 10));
      // Show sequence again briefly
      setIsShowingSequence(true);
      setUserSequence([]);
      setTimeout(() => setIsShowingSequence(false), 1000);
    } else if (newUserSeq.length === currentSequence.length) {
      // Success
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore((prev) => prev + (50 * newCombo * level));
      setLevel((prev) => prev + 1);
      setTimeout(() => generateSequence(level + 1), 500);
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="flex-1 bg-[#0a0a0c] flex flex-col items-center justify-center p-6 relative">
        <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white/5 rounded-full hover:bg-white/10 text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-24 h-24 rounded-full bg-[#f472b6]/20 flex items-center justify-center mb-6">
          <Brain className="w-12 h-12 text-[#f472b6]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Memory Sprint</h1>
        <p className="text-[#a1a1aa] text-center max-w-md mb-8">
          Memorize the sequence of numbers and recall them as fast as you can. You have exactly 1 minute.
        </p>
        <button onClick={startGame} className="bg-[#f472b6] hover:bg-[#db2777] text-white px-12 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(244,114,182,0.3)]">
          Start Sprint
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0a0a0c] flex flex-col items-center p-6 relative">
      <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white/5 rounded-full hover:bg-white/10 text-white z-10">
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Header Stats */}
      <div className="w-full max-w-md flex justify-between items-center mb-12 mt-4 px-12">
        <div className="flex flex-col items-center bg-white/5 px-4 py-2 rounded-2xl">
          <span className="text-[#a1a1aa] text-xs font-bold uppercase tracking-wider mb-1">Time</span>
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-[#38bdf8]'}`} />
            <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>0:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white/5 px-4 py-2 rounded-2xl">
          <span className="text-[#a1a1aa] text-xs font-bold uppercase tracking-wider mb-1">Score</span>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#facc15]" />
            <span className="text-xl font-bold text-white">{score}</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8 h-12">
        <AnimatePresence mode="wait">
          {combo > 1 && (
            <motion.div
              key="combo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-[#facc15] font-bold text-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" /> {combo}x Combo!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sequence Display Area */}
      <div className="w-full max-w-sm aspect-[2/1] bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mb-12 p-6 shadow-inner relative overflow-hidden">
        {gameState === 'gameover' ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Time's Up!</h2>
            <p className="text-[#a1a1aa]">Final Score: {score}</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <AnimatePresence>
              {isShowingSequence ? (
                currentSequence.map((num, i) => (
                  <motion.div
                    key={`seq-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className="w-12 h-12 rounded-xl bg-[#f472b6]/20 border border-[#f472b6]/40 flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_15px_rgba(244,114,182,0.3)]"
                  >
                    {num}
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {currentSequence.map((_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl font-bold ${
                        i < userSequence.length 
                          ? 'bg-[#34d399]/20 border-[#34d399]/40 text-[#34d399] shadow-[0_0_10px_rgba(52,211,153,0.3)]' 
                          : 'bg-white/5 border-white/10 text-transparent'
                      }`}
                    >
                      {i < userSequence.length ? userSequence[i] : '?'}
                    </div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Numpad */}
      <div className="w-full max-w-sm grid grid-cols-3 gap-4 px-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={isShowingSequence || gameState === 'gameover'}
            className={`
              aspect-square rounded-2xl text-3xl font-bold flex items-center justify-center transition-all
              ${isShowingSequence || gameState === 'gameover' 
                ? 'bg-white/5 text-white/20 border border-white/5' 
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 active:bg-white/30 active:scale-95 shadow-sm'}
            `}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
