import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, XCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface DecisionMakingGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function DecisionMakingGame({ onBack, onGameComplete }: DecisionMakingGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [options, setOptions] = useState<{ id: number, cost: number, return: number, probability: number, expectedValue: number }[]>([]);

  const generateTrial = (currentLevel: number) => {
    const numOptions = Math.min(4, 2 + Math.floor(currentLevel / 5));
    const newOptions = [];

    for (let i = 0; i < numOptions; i++) {
      const cost = Math.floor(Math.random() * 50) + 10;
      const ret = cost + Math.floor(Math.random() * 100) + 20;
      const probability = Math.floor(Math.random() * 60) + 30; // 30% to 90%
      
      const expectedValue = (ret * (probability / 100)) - cost;
      
      newOptions.push({
        id: i,
        cost,
        return: ret,
        probability,
        expectedValue
      });
    }

    setOptions(newOptions);
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
    generateTrial(1);
  };

  const handleChoice = (id: number) => {
    if (feedback !== null) return;

    let bestOptionId = options[0].id;
    let maxEV = options[0].expectedValue;

    for (let i = 1; i < options.length; i++) {
      if (options[i].expectedValue > maxEV) {
        maxEV = options[i].expectedValue;
        bestOptionId = options[i].id;
      }
    }

    if (id === bestOptionId) {
      setScore(s => s + 15 * level);
      setFeedback('correct');
      if (score > 0 && score % 150 === 0) setLevel(l => l + 1);
    } else {
      setScore(s => Math.max(0, s - 10));
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      generateTrial(level);
    }, 800);
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Decision Making</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <TrendingUp className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Investment Decision</h2>
          <p className="text-white/60 mb-12">
            Evaluate the investments and quickly choose the one with the highest Expected Value.
            <br/><br/>
            <strong>Expected Value</strong> = (Return × Probability) - Cost
          </p>
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
          <div className="w-full max-w-3xl">
            <h3 className="text-2xl font-bold text-center mb-8">Choose the best investment</h3>
            
            <div className={`grid grid-cols-1 md:grid-cols-${options.length === 2 ? '2' : options.length === 3 ? '3' : '2'} gap-6`}>
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt.id)}
                  className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-white/10 transition-all text-left relative overflow-hidden group"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/60 font-medium">Option {String.fromCharCode(65 + opt.id)}</span>
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Cost</span>
                      <span className="font-bold text-rose-400">-{opt.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Potential Return</span>
                      <span className="font-bold text-emerald-400">+{opt.return}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-3">
                      <span className="text-white/60">Success Chance</span>
                      <span className="font-bold text-blue-400">{opt.probability}%</span>
                    </div>
                  </div>

                  {feedback && (
                    <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10 ${
                      opt.expectedValue === Math.max(...options.map(o => o.expectedValue)) 
                        ? 'bg-emerald-500/20' 
                        : 'bg-black/40'
                    }`}>
                      {opt.expectedValue === Math.max(...options.map(o => o.expectedValue)) && <CheckCircle2 className="w-16 h-16 text-emerald-400" />}
                      <div className="absolute bottom-4 left-0 right-0 text-center font-bold">
                        EV: {opt.expectedValue.toFixed(1)}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {feedback === 'wrong' && (
              <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
                <XCircle className="w-32 h-32 text-rose-500 opacity-50" />
              </div>
            )}
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
