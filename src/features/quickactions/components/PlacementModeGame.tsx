import React, { useState, useEffect } from 'react';
import { ArrowLeft, Rocket, Clock, Target, CheckCircle2, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlacementModeGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

type QuestionType = 'math' | 'logic';

interface Question {
  type: QuestionType;
  question: string;
  options: string[];
  answer: string;
  level: number;
}

export default function PlacementModeGame({ onBack, onGameComplete }: PlacementModeGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [history, setHistory] = useState<{correct: boolean, level: number}[]>([]);

  const generateQuestion = (level: number): Question => {
    const isMath = Math.random() > 0.4;
    
    if (isMath) {
      let a, b, op;
      if (level <= 3) {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        op = '+';
      } else if (level <= 6) {
        a = Math.floor(Math.random() * 20) + 10;
        b = Math.floor(Math.random() * 20) + 1;
        op = Math.random() > 0.5 ? '+' : '-';
      } else if (level <= 10) {
        a = Math.floor(Math.random() * 12) + 2;
        b = Math.floor(Math.random() * 12) + 2;
        op = '*';
      } else {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 10) + 2;
        op = Math.random() > 0.5 ? '*' : '/';
        if (op === '/') a = a * b; // ensure integer result
      }

      let ans = 0;
      if (op === '+') ans = a + b;
      if (op === '-') ans = a - b;
      if (op === '*') ans = a * b;
      if (op === '/') ans = a / b;

      const options = [ans.toString()];
      while(options.length < 4) {
        const fake = ans + Math.floor(Math.random() * (level * 2 + 5)) - (level + 2);
        if (fake !== ans && !options.includes(fake.toString())) {
          options.push(fake.toString());
        }
      }

      return {
        type: 'math',
        question: `${a} ${op} ${b} = ?`,
        options: options.sort(() => Math.random() - 0.5),
        answer: ans.toString(),
        level
      };
    } else {
      // Logic sequence
      const start = Math.floor(Math.random() * (level * 5)) + 1;
      let step = Math.floor(Math.random() * level) + 1;
      if (level > 5 && Math.random() > 0.5) step = -step; // can go down

      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      const ans = start + 4 * step;
      
      const options = [ans.toString()];
      while(options.length < 4) {
        const fake = ans + Math.floor(Math.random() * 10) - 5;
        if (fake !== ans && !options.includes(fake.toString())) {
          options.push(fake.toString());
        }
      }

      return {
        type: 'logic',
        question: `${seq.join(', ')}, ?`,
        options: options.sort(() => Math.random() - 0.5),
        answer: ans.toString(),
        level
      };
    }
  };

  const startGame = () => {
    setCurrentQuestion(generateQuestion(1));
    setGameState('playing');
    setTimeLeft(300);
    setCurrentLevel(1);
    setHistory([]);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      // Calculate final placement score (max level achieved adjusted by accuracy)
      const maxLvl = Math.max(...history.map(h => h.level), 1);
      const acc = history.length > 0 ? history.filter(h => h.correct).length / history.length : 0;
      const finalScore = Math.floor(maxLvl * 100 * acc);
      onGameComplete(finalScore, maxLvl);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, history, onGameComplete]);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    
    const isCorrect = answer === currentQuestion.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    setHistory(prev => [...prev, { correct: isCorrect, level: currentLevel }]);

    setTimeout(() => {
      setFeedback(null);
      
      let nextLevel = currentLevel;
      if (isCorrect) {
        nextLevel += 1;
      } else {
        nextLevel = Math.max(1, nextLevel - 1);
      }
      setCurrentLevel(nextLevel);
      setCurrentQuestion(generateQuestion(nextLevel));
    }, 800);
  };

  if (gameState === 'intro') {
    return (
      <div className="flex-1 bg-[#0a0a0c] flex flex-col items-center justify-center p-6 relative">
        <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white/5 rounded-full hover:bg-white/10 text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-24 h-24 rounded-full bg-[#fb923c]/20 flex items-center justify-center mb-6">
          <Rocket className="w-12 h-12 text-[#fb923c]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Placement Mode</h1>
        <p className="text-[#a1a1aa] text-center max-w-md mb-8">
          This 5-minute test adapts to your skill level. Answer correctly to increase the difficulty and find your baseline.
        </p>
        <button onClick={startGame} className="bg-[#fb923c] hover:bg-[#ea580c] text-white px-12 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(251,146,60,0.3)]">
          Begin Assessment
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
              <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${timeLeft <= 30 ? 'text-red-400 animate-pulse' : 'text-[#38bdf8]'}`} />
              <span className={`text-lg sm:text-xl font-bold ${timeLeft <= 30 ? 'text-red-400' : 'text-white'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-[#fb923c]/30 shadow-[0_0_15px_rgba(251,146,60,0.1)]">
            <span className="text-[#fb923c] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Level</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#fb923c]" />
              <span className="text-lg sm:text-xl font-bold text-white">{currentLevel}</span>
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
              <h2 className="text-4xl font-bold text-white mb-4">Assessment Complete!</h2>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-6">
                <p className="text-[#a1a1aa] mb-2 uppercase tracking-wider text-sm font-bold">Recommended Level</p>
                <div className="text-5xl font-black text-[#fb923c]">{Math.max(...history.map(h => h.level), 1)}</div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion?.question}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <div className="mb-4 text-[#a1a1aa] uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                {currentQuestion?.type === 'logic' ? 'COMPLETE THE PATTERN' : 'SOLVE'}
              </div>
              
              <div className="text-5xl font-black mb-12 text-center text-white">
                {currentQuestion?.question}
              </div>

              <div className="grid w-full gap-4 grid-cols-2">
                {currentQuestion?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => !feedback && handleAnswer(opt)}
                    disabled={feedback !== null}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-2xl py-8 rounded-2xl border border-white/10 active:scale-95 transition-all shadow-sm"
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
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
            >
              {feedback === 'correct' ? (
                <>
                  <CheckCircle2 className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)] mb-4" />
                  <div className="text-emerald-400 font-bold text-xl flex items-center gap-2 bg-emerald-900/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    <TrendingUp className="w-5 h-5" /> Level Up
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-32 h-32 text-rose-400 drop-shadow-[0_0_20px_rgba(251,113,133,0.5)] mb-4" />
                  <div className="text-rose-400 font-bold text-xl flex items-center gap-2 bg-rose-900/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    <TrendingDown className="w-5 h-5" /> Level Down
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
