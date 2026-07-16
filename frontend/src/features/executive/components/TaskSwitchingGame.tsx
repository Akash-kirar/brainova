import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';

interface TaskSwitchingGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function TaskSwitchingGame({ onBack, onGameComplete, difficulty = 'medium' }: TaskSwitchingGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  const [currentTask, setCurrentTask] = useState<'letter' | 'number'>('letter');
  const [currentItem, setCurrentItem] = useState({ letter: 'A', number: 2 });
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

  const generateTrial = useCallback(() => {
    const isLetterTask = Math.random() > 0.5;
    setCurrentTask(isLetterTask ? 'letter' : 'number');

    const isVowel = Math.random() > 0.5;
    const isEven = Math.random() > 0.5;

    const letter = isVowel 
      ? vowels[Math.floor(Math.random() * vowels.length)]
      : consonants[Math.floor(Math.random() * consonants.length)];
    
    const number = isEven
      ? [2, 4, 6, 8][Math.floor(Math.random() * 4)]
      : [1, 3, 5, 7, 9][Math.floor(Math.random() * 5)];

    setCurrentItem({ letter, number });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      setTimeout(() => {
        onGameComplete(score, level);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, level, onGameComplete]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setGameState('playing');
    generateTrial();
  };

  const handleChoice = (choice: 'left' | 'right') => {
    if (feedback !== null) return;

    let isCorrect = false;
    if (currentTask === 'letter') {
      const isVowel = vowels.includes(currentItem.letter);
      isCorrect = (choice === 'left' && isVowel) || (choice === 'right' && !isVowel);
    } else {
      const isEven = currentItem.number % 2 === 0;
      isCorrect = (choice === 'left' && isEven) || (choice === 'right' && !isEven);
    }

    if (isCorrect) {
      setScore(s => s + 10 * level);
      setFeedback('correct');
      if (score > 0 && score % 100 === 0) setLevel(l => l + 1);
    } else {
      setScore(s => Math.max(0, s - 5));
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      generateTrial();
    }, 400);
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Task Switching</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-12 h-12 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Task Switching</h2>
          <div className="text-white/60 mb-12 space-y-4 text-left bg-white/5 p-6 rounded-2xl">
            <p>Pay attention to the background color!</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>If the background is <span className="text-blue-400 font-bold">BLUE</span>, look at the LETTER. Left = Vowel, Right = Consonant.</li>
              <li>If the background is <span className="text-amber-400 font-bold">ORANGE</span>, look at the NUMBER. Left = Even, Right = Odd.</li>
            </ul>
          </div>
          <button 
            onClick={startGame}
            className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full text-xl transition-all w-full"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-white/5 z-10 relative bg-[#0a0a0c]">
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

      <div className="flex-1 flex flex-col relative">
        {gameState === 'playing' ? (
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-colors duration-300 ${currentTask === 'letter' ? 'bg-blue-900/40' : 'bg-amber-900/40'}`}>
            <div className="text-center mb-16">
              <h3 className="text-2xl font-bold mb-2 opacity-80 uppercase tracking-widest">
                {currentTask === 'letter' ? 'Letter Task' : 'Number Task'}
              </h3>
            </div>
            
            <div className="relative">
              <div className="text-[120px] font-bold font-mono tracking-widest leading-none flex items-center gap-8 bg-white/10 px-12 py-8 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/20">
                <span>{currentItem.letter}</span>
                <span>{currentItem.number}</span>
              </div>
              
              {feedback === 'correct' && (
                <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm z-10">
                  <CheckCircle2 className="w-24 h-24 text-emerald-400" />
                </div>
              )}
              {feedback === 'wrong' && (
                <div className="absolute inset-0 bg-rose-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm z-10">
                  <XCircle className="w-24 h-24 text-rose-400" />
                </div>
              )}
            </div>

            <div className="absolute bottom-12 left-0 right-0 px-6 flex justify-between gap-4 max-w-2xl mx-auto w-full">
              <button 
                onClick={() => handleChoice('left')}
                className="flex-1 py-8 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-2xl text-2xl font-bold transition-colors border border-white/10"
              >
                {currentTask === 'letter' ? 'Vowel' : 'Even'}
              </button>
              <button 
                onClick={() => handleChoice('right')}
                className="flex-1 py-8 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-2xl text-2xl font-bold transition-colors border border-white/10"
              >
                {currentTask === 'letter' ? 'Consonant' : 'Odd'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-2">Level Reached: {level}</p>
            <p className="text-xl text-white/60 mb-8">Final Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
