import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Clock, Target, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MathDrillGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function MathDrillGame({ onBack, onGameComplete }: MathDrillGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds for testing
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [question, setQuestion] = useState<{q: string, ans: number, options: number[]}>({q: '', ans: 0, options: []});
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateMathQuestion = () => {
    // Generate options based on combo to increase difficulty slightly
    const isHard = combo > 10;
    
    const opRand = Math.random();
    let op = '+';
    let a, b, ans;

    if (opRand < 0.4) {
      op = '+';
      a = Math.floor(Math.random() * (isHard ? 50 : 20)) + 1;
      b = Math.floor(Math.random() * (isHard ? 50 : 20)) + 1;
      ans = a + b;
    } else if (opRand < 0.7) {
      op = '-';
      a = Math.floor(Math.random() * (isHard ? 50 : 20)) + 10;
      b = Math.floor(Math.random() * (isHard ? 30 : 15)) + 1;
      if (b > a) [a, b] = [b, a];
      ans = a - b;
    } else {
      op = '*';
      a = Math.floor(Math.random() * (isHard ? 12 : 9)) + 2;
      b = Math.floor(Math.random() * (isHard ? 12 : 9)) + 2;
      ans = a * b;
    }

    const options = [ans];
    while(options.length < 4) {
      const fake = ans + Math.floor(Math.random() * 10) - 5;
      if (fake !== ans && !options.includes(fake)) {
        options.push(fake);
      }
    }

    setQuestion({
      q: `${a} ${op} ${b} = ?`,
      ans,
      options: options.sort(() => Math.random() - 0.5)
    });
  };

  const startGame = () => {
    generateMathQuestion();
    setGameState('playing');
    setTimeLeft(15);
    setScore(0);
    setCombo(0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      setTimeout(() => onGameComplete(score, Math.floor(combo/5) + 1), 2000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, combo, onGameComplete]);

  const handleAnswer = (answer: number) => {
    const isCorrect = answer === question.ans;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(prev => prev + 10 + (Math.floor(newCombo/3) * 5));
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      setFeedback(null);
      generateMathQuestion();
    }, 400);
  };

  if (gameState === 'intro') {
    return (
      <div className="flex-1 bg-[#0a0a0c] flex flex-col items-center justify-center p-6 relative">
        <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white/5 rounded-full hover:bg-white/10 text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-24 h-24 rounded-full bg-[#facc15]/20 flex items-center justify-center mb-6">
          <Calculator className="w-12 h-12 text-[#facc15]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Math Drill</h1>
        <p className="text-[#a1a1aa] text-center max-w-md mb-8">
          2 minutes. Pure arithmetic. Solve as many problems as you can and build your combo!
        </p>
        <button onClick={startGame} className="bg-[#facc15] hover:bg-[#eab308] text-black px-12 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
          Start Drill
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
      <div className="w-full max-w-md flex justify-between items-center mb-8 mt-4 px-12">
        <div className="flex flex-col items-center bg-white/5 px-4 py-2 rounded-2xl">
          <span className="text-[#a1a1aa] text-xs font-bold uppercase tracking-wider mb-1">Time</span>
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-[#facc15]'}`} />
            <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white/5 px-4 py-2 rounded-2xl">
          <span className="text-[#a1a1aa] text-xs font-bold uppercase tracking-wider mb-1">Score</span>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#34d399]" />
            <span className="text-xl font-bold text-white">{score}</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8 h-12">
        <AnimatePresence mode="wait">
          {combo > 2 && (
            <motion.div
              key="combo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-[#facc15] font-bold text-lg flex items-center justify-center gap-2 bg-[#facc15]/10 px-4 py-1 rounded-full border border-[#facc15]/30"
            >
              <Zap className="w-5 h-5" /> {combo} Combo!
            </motion.div>
          )}
        </AnimatePresence>
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
              <h2 className="text-4xl font-bold text-white mb-4">Drill Complete!</h2>
              <p className="text-[#a1a1aa] text-xl mb-8">Final Score: <span className="text-[#facc15] font-bold">{score}</span></p>
              <button onClick={onBack} className="bg-[#818cf8] hover:bg-[#6366f1] text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(129,140,248,0.3)]">Continue</button>
            </motion.div>
          ) : (
            <motion.div
              key={question.q}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-6xl font-black mb-12 text-center text-white tracking-widest drop-shadow-md">
                {question.q}
              </div>

              <div className="grid w-full gap-4 grid-cols-2">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => !feedback && handleAnswer(opt)}
                    disabled={feedback !== null}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-3xl py-8 rounded-2xl border border-white/10 active:scale-95 transition-all shadow-sm flex items-center justify-center"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-[#0a0a0c]/40 rounded-3xl"
            >
              {feedback === 'correct' ? (
                <CheckCircle2 className="w-32 h-32 text-[#34d399] drop-shadow-[0_0_30px_rgba(52,211,153,0.8)]" />
              ) : (
                <XCircle className="w-32 h-32 text-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.8)]" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
