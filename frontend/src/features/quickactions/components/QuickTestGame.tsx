import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickTestGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

type QuestionType = 'math' | 'color' | 'logic';

interface Question {
  type: QuestionType;
  question: string;
  options: string[];
  answer: string;
  color?: string; // For color questions
}

export default function QuickTestGame({ onBack, onGameComplete, difficulty = 'easy' }: QuickTestGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const colors = [
    { name: 'RED', hex: '#ef4444' },
    { name: 'BLUE', hex: '#3b82f6' },
    { name: 'GREEN', hex: '#22c55e' },
    { name: 'YELLOW', hex: '#eab308' },
    { name: 'PURPLE', hex: '#a855f7' }
  ];

  const generateQuestions = () => {
    const newQuestions: Question[] = [];
    for (let i = 0; i < 30; i++) {
      const typeRand = Math.random();
      if (typeRand < 0.4) {
        // Math
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const op = Math.random() > 0.5 ? '+' : '-';
        const ans = op === '+' ? a + b : a - b;
        
        // Generate options
        const options = [ans.toString()];
        while(options.length < 4) {
          const fake = ans + Math.floor(Math.random() * 10) - 5;
          if (fake !== ans && !options.includes(fake.toString())) {
            options.push(fake.toString());
          }
        }
        
        newQuestions.push({
          type: 'math',
          question: `${a} ${op} ${b} = ?`,
          options: options.sort(() => Math.random() - 0.5),
          answer: ans.toString()
        });
      } else if (typeRand < 0.8) {
        // Color
        const textObj = colors[Math.floor(Math.random() * colors.length)];
        const colorObj = colors[Math.floor(Math.random() * colors.length)];
        
        const isMatch = textObj.name === colorObj.name;
        
        newQuestions.push({
          type: 'color',
          question: textObj.name,
          color: colorObj.hex,
          options: ['YES', 'NO'],
          answer: isMatch ? 'YES' : 'NO'
        });
      } else {
        // Logic (Sequence)
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 1;
        const seq = [start, start + step, start + 2 * step, start + 3 * step];
        
        const ans = start + 4 * step;
        const options = [ans.toString()];
        while(options.length < 4) {
          const fake = ans + Math.floor(Math.random() * 10) - 5;
          if (fake !== ans && !options.includes(fake.toString())) {
            options.push(fake.toString());
          }
        }
        
        newQuestions.push({
          type: 'logic',
          question: `${seq.join(', ')}, ?`,
          options: options.sort(() => Math.random() - 0.5),
          answer: ans.toString()
        });
      }
    }
    setQuestions(newQuestions);
  };

  const startGame = () => {
    generateQuestions();
    setGameState('playing');
    setTimeLeft(300);
    setScore(0);
    setCurrentQuestionIndex(0);
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
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = answer === currentQ.answer;
    
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(prev => prev + 50);
    } else {
      setScore(prev => Math.max(0, prev - 20));
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Generate more questions if they finish all 30
        generateQuestions();
        setCurrentQuestionIndex(0);
      }
    }, 500);
  };

  if (gameState === 'intro') {
    return (
      <div className="flex-1 bg-[#0a0a0c] flex flex-col items-center justify-center p-6 relative">
        <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white/5 rounded-full hover:bg-white/10 text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-24 h-24 rounded-full bg-[#e879f9]/20 flex items-center justify-center mb-6">
          <Sparkles className="w-12 h-12 text-[#e879f9]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Quick Test</h1>
        <p className="text-[#a1a1aa] text-center max-w-md mb-8">
          A 5-minute mixed challenge testing math, logic, and reaction. Answer as many questions as you can!
        </p>
        <button onClick={startGame} className="bg-[#e879f9] hover:bg-[#d946ef] text-white px-12 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(232,121,249,0.3)]">
          Start Test
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

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
              <h2 className="text-4xl font-bold text-white mb-4">Test Complete!</h2>
              <p className="text-[#a1a1aa] text-xl">Final Score: <span className="text-[#e879f9] font-bold">{score}</span></p>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestionIndex}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <div className="mb-4 text-[#a1a1aa] uppercase tracking-widest text-sm font-bold">
                {currentQ?.type === 'color' ? 'DOES TEXT MATCH COLOR?' : 
                 currentQ?.type === 'logic' ? 'COMPLETE THE PATTERN' : 'SOLVE'}
              </div>
              
              <div 
                className={`text-5xl font-black mb-12 text-center ${currentQ?.type === 'color' ? '' : 'text-white'}`}
                style={currentQ?.type === 'color' ? { color: currentQ.color } : {}}
              >
                {currentQ?.question}
              </div>

              <div className={`grid w-full gap-4 ${currentQ?.options.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                {currentQ?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => !feedback && handleAnswer(opt)}
                    disabled={feedback !== null}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xl py-6 rounded-2xl border border-white/10 active:scale-95 transition-all"
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
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              {feedback === 'correct' ? (
                <CheckCircle2 className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
              ) : (
                <XCircle className="w-32 h-32 text-rose-400 drop-shadow-[0_0_20px_rgba(251,113,133,0.5)]" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
