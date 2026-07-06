import React, { useState, useEffect } from 'react';
import { ArrowLeft, GraduationCap, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SmartGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function SmartGame({ onBack, onGameComplete }: SmartGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds for testing
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<{shapes: string[], missingIndex: number, options: string[], ans: string}>({shapes: [], missingIndex: 0, options: [], ans: ''});
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const shapes = ['◯', '△', '▢', '◇', '☆', '♡'];
  
  const generateLogicQuestion = () => {
    // Generate a simple pattern (A B A B, or A B C A B C)
    const patternType = Math.random() > 0.5 ? 2 : 3;
    const basePattern: string[] = [];
    while (basePattern.length < patternType) {
      const sh = shapes[Math.random() * shapes.length | 0];
      if (!basePattern.includes(sh)) {
        basePattern.push(sh);
      }
    }

    const fullSequence = [];
    for (let i = 0; i < 6; i++) {
      fullSequence.push(basePattern[i % patternType]);
    }

    const missingIndex = Math.floor(Math.random() * 3) + 3; // hide one of the last 3
    const ans = fullSequence[missingIndex];
    fullSequence[missingIndex] = '?';

    const options = [ans];
    while(options.length < 4) {
      const fake = shapes[Math.random() * shapes.length | 0];
      if (!options.includes(fake)) {
        options.push(fake);
      }
    }

    setQuestion({
      shapes: fullSequence,
      missingIndex,
      options: options.sort(() => Math.random() - 0.5),
      ans
    });
  };

  const startGame = () => {
    generateLogicQuestion();
    setGameState('playing');
    setTimeLeft(15);
    setScore(0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      setTimeout(() => onGameComplete(score, Math.floor(score/100) + 1), 2000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, onGameComplete]);

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === question.ans;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(prev => prev + 50);
    } else {
      setScore(prev => Math.max(0, prev - 10));
    }

    setTimeout(() => {
      setFeedback(null);
      generateLogicQuestion();
    }, 500);
  };

  if (gameState === 'intro') {
    return (
      <div className="flex-1 bg-[#0a0a0c] flex flex-col items-center justify-center p-6 relative">
        <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white/5 rounded-full hover:bg-white/10 text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-24 h-24 rounded-full bg-[#818cf8]/20 flex items-center justify-center mb-6">
          <GraduationCap className="w-12 h-12 text-[#818cf8]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Smart Mode</h1>
        <p className="text-[#a1a1aa] text-center max-w-md mb-8">
          1 minute logic challenge. Find the missing shape in the pattern as fast as you can.
        </p>
        <button onClick={startGame} className="bg-[#818cf8] hover:bg-[#6366f1] text-white px-12 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(129,140,248,0.3)]">
          Start Challenge
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0a0a0c] flex flex-col items-center p-2 sm:p-6 relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-8 sm:mb-12 mt-4 px-4 sm:px-6 relative z-10">
        <button onClick={onBack} className="p-2 sm:p-3 bg-white/5 rounded-full hover:bg-white/10 text-white shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="flex gap-3 sm:gap-6">
          <div className="flex flex-col items-center bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl">
            <span className="text-[#a1a1aa] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Time</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-[#818cf8]'}`} />
              <span className={`text-lg sm:text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                0:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl">
            <span className="text-[#a1a1aa] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Score</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#facc15]" />
              <span className="text-lg sm:text-xl font-bold text-white">{score}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {gameState === 'gameover' ? (
            <motion.div
              key="gameover"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Challenge Complete!</h2>
              <p className="text-[#a1a1aa] text-xl mb-8">Final Score: <span className="text-[#818cf8] font-bold">{score}</span></p>
              <button onClick={onBack} className="bg-[#818cf8] hover:bg-[#6366f1] text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(129,140,248,0.3)]">Continue</button>
            </motion.div>
          ) : (
            <motion.div
              key={question.shapes.join()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full flex flex-col items-center"
            >
              <div className="mb-8 text-[#a1a1aa] uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                COMPLETE THE PATTERN
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 sm:mb-16">
                {question.shapes.map((sh, i) => (
                  <div key={i} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl ${sh === '?' ? 'bg-white/10 text-white/50 border-2 border-dashed border-white/20' : 'bg-white/5 text-white shadow-sm border border-white/10'}`}>
                    {sh}
                  </div>
                ))}
              </div>

              <div className="grid w-full gap-3 sm:gap-4 grid-cols-2">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => !feedback && handleAnswer(opt)}
                    disabled={feedback !== null}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-3xl sm:text-4xl py-4 sm:py-6 rounded-2xl border border-white/10 active:scale-95 transition-all shadow-sm flex items-center justify-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              {feedback === 'correct' ? (
                <CheckCircle2 className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.5)]" />
              ) : (
                <XCircle className="w-32 h-32 text-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
