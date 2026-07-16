import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PatternRecognitionGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function PatternRecognitionGame({ onBack, onGameComplete }: PatternRecognitionGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<{pattern: boolean[], options: boolean[][]}>({pattern: [], options: []});
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateQuestion = () => {
    // 3x3 grid
    const target = Array.from({length: 9}, () => Math.random() > 0.6);
    
    // Generate 3 wrong options that are slightly different
    const options = [target];
    while(options.length < 4) {
      const wrong = [...target];
      // Flip 1-2 random cells
      const flips = 1 + Math.floor(Math.random() * 2);
      for(let i=0; i<flips; i++) {
        const idx = Math.floor(Math.random() * 9);
        wrong[idx] = !wrong[idx];
      }
      // Check if unique
      if (!options.some(opt => opt.every((val, i) => val === wrong[i]))) {
        options.push(wrong);
      }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    setQuestion({ pattern: target, options });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      setTimeout(() => {
        onGameComplete(score, Math.floor(score / 5));
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, onGameComplete]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    generateQuestion();
  };

  const handleAnswer = (selected: boolean[]) => {
    if (feedback !== null) return;
    
    const isCorrect = selected.every((val, i) => val === question.pattern[i]);
    if (isCorrect) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setScore(s => Math.max(0, s - 5));
      setFeedback('wrong');
    }
    
    setTimeout(() => {
      setFeedback(null);
      generateQuestion();
    }, 500);
  };

  const GridDisplay = ({ pattern, isTarget = false }: { pattern: boolean[], isTarget?: boolean }) => (
    <div className={`grid grid-cols-3 gap-1 p-2 bg-white/5 rounded-xl ${isTarget ? 'w-32 h-32' : 'w-24 h-24'}`}>
      {pattern.map((active, i) => (
        <div 
          key={i} 
          className={`rounded-sm ${active ? 'bg-indigo-500' : 'bg-white/10'}`}
        />
      ))}
    </div>
  );

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Pattern Recognition</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-12 h-12 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Pattern Recognition</h2>
          <p className="text-white/60 mb-12 max-w-sm">
            Find the exact matching pattern from the options provided below.
          </p>
          <button 
            onClick={startGame}
            className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full text-xl transition-all"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-xl">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-400" />
            <span className="font-bold text-xl">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {gameState === 'playing' ? (
          <div className="w-full max-w-md flex flex-col items-center">
            <h3 className="text-lg font-medium text-white/60 mb-4">Target Pattern</h3>
            <div className="relative mb-12">
              <GridDisplay pattern={question.pattern} isTarget />
              {feedback === 'correct' && (
                <div className="absolute inset-0 bg-emerald-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm z-10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
              )}
              {feedback === 'wrong' && (
                <div className="absolute inset-0 bg-rose-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm z-10">
                  <XCircle className="w-12 h-12 text-rose-400" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center transition-all"
                >
                  <GridDisplay pattern={opt} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-8">Final Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
