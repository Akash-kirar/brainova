import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MentalRotationGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function MentalRotationGame({ onBack, onGameComplete }: MentalRotationGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<{letter: string, isMirrored: boolean, rotation: number}>({letter: 'F', isMirrored: false, rotation: 0});
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const letters = ['F', 'R', 'P', 'G', 'L'];

  const generateQuestion = () => {
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const isMirrored = Math.random() > 0.5;
    const rotation = Math.floor(Math.random() * 8) * 45; // 0, 45, 90, 135...
    setQuestion({ letter, isMirrored, rotation });
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

  const handleAnswer = (isMirrored: boolean) => {
    if (feedback !== null) return;
    
    if (isMirrored === question.isMirrored) {
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
          <h1 className="text-2xl font-bold">Mental Rotation</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-12 h-12 text-rose-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Mental Rotation</h2>
          <p className="text-white/60 mb-12 max-w-sm">
            Look at the rotated letter and decide if it is a normal letter or a mirrored (backward) letter.
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
                key={`${question.letter}-${question.rotation}-${question.isMirrored}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-48 h-48 bg-white/5 rounded-3xl flex items-center justify-center mb-12 relative"
              >
                <div 
                  className="text-8xl font-bold text-white transition-transform duration-300"
                  style={{
                    transform: `rotate(${question.rotation}deg) scaleX(${question.isMirrored ? -1 : 1})`
                  }}
                >
                  {question.letter}
                </div>
                {feedback === 'correct' && (
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl flex items-center justify-center">
                    <CheckCircle2 className="w-20 h-20 text-emerald-400" />
                  </div>
                )}
                {feedback === 'wrong' && (
                  <div className="absolute inset-0 bg-rose-500/20 rounded-3xl flex items-center justify-center">
                    <XCircle className="w-20 h-20 text-rose-400" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-6 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold rounded-2xl text-xl transition-all border border-blue-500/30"
              >
                Normal
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-6 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-bold rounded-2xl text-xl transition-all border border-purple-500/30"
              >
                Mirrored
              </button>
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
