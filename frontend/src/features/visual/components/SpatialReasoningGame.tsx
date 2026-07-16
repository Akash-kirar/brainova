import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpatialReasoningGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function SpatialReasoningGame({ onBack, onGameComplete }: SpatialReasoningGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<{blocksCount: number, options: number[]}>({blocksCount: 0, options: []});
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateQuestion = () => {
    const count = 5 + Math.floor(Math.random() * 10);
    const options = [count];
    while(options.length < 4) {
      const wrong = count + (Math.floor(Math.random() * 5) - 2);
      if (wrong > 0 && !options.includes(wrong)) {
        options.push(wrong);
      }
    }
    options.sort(() => Math.random() - 0.5);
    setQuestion({ blocksCount: count, options });
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

  const handleAnswer = (selected: number) => {
    if (feedback !== null) return;
    
    if (selected === question.blocksCount) {
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

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Spatial Reasoning</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Spatial Reasoning</h2>
          <p className="text-white/60 mb-12 max-w-sm">
            Quickly estimate or count the number of blocks you see.
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
            <AnimatePresence mode="wait">
              <motion.div
                key={question.blocksCount}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full h-48 bg-white/5 rounded-3xl flex items-center justify-center mb-12 relative"
              >
                {/* Visual proxy for blocks */}
                <div className="flex flex-wrap gap-2 justify-center p-4 max-w-[200px]">
                  {Array.from({length: question.blocksCount}).map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-cyan-500 rounded shadow-md border-b-4 border-r-4 border-cyan-700 transform rotate-45" />
                  ))}
                </div>
                
                {feedback === 'correct' && (
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm z-10">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                  </div>
                )}
                {feedback === 'wrong' && (
                  <div className="absolute inset-0 bg-rose-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm z-10">
                    <XCircle className="w-12 h-12 text-rose-400" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4 w-full">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="py-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-2xl font-bold transition-all"
                >
                  {opt}
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
