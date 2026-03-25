import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, CheckCircle, ArrowRight, Activity, Zap, Target, ArrowLeft, Trophy } from 'lucide-react';
import MemoryGridGame from './MemoryGridGame';
import ReactionSpeedGame from './ReactionSpeedGame';

type TrainingStep = 'analyzing' | 'plan' | 'playing' | 'summary';

interface DailyTrainingProps {
  onBack: () => void;
  onWorkoutComplete?: (totalScore: number) => void;
}

interface WorkoutGame {
  id: string;
  name: string;
  type: 'memory' | 'speed';
  difficulty: 'easy' | 'medium' | 'hard';
  icon: React.ReactNode;
  color: string;
}

const WORKOUT_PLAN: WorkoutGame[] = [
  { id: 'g1', name: 'Memory Matrix', type: 'memory', difficulty: 'medium', icon: <Brain className="w-6 h-6" />, color: 'text-indigo-400' },
  { id: 'g2', name: 'Reaction Speed', type: 'speed', difficulty: 'hard', icon: <Zap className="w-6 h-6" />, color: 'text-rose-400' },
  { id: 'g3', name: 'Memory Matrix', type: 'memory', difficulty: 'hard', icon: <Brain className="w-6 h-6" />, color: 'text-indigo-400' },
];

export default function DailyTraining({ onBack, onWorkoutComplete }: DailyTrainingProps) {
  const [step, setStep] = useState<TrainingStep>('analyzing');
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    if (step === 'analyzing') {
      const timer = setTimeout(() => {
        setStep('plan');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleGameComplete = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);

    if (currentGameIndex < WORKOUT_PLAN.length - 1) {
      setCurrentGameIndex(i => i + 1);
    } else {
      setStep('summary');
    }
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Daily Training</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* Analyzing State */}
          {step === 'analyzing' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                <div className="w-24 h-24 bg-[#1a1a1c] border border-indigo-500/30 rounded-full flex items-center justify-center relative z-10">
                  <Brain className="w-10 h-10 text-indigo-400 animate-bounce" />
                </div>
                {/* Orbital dots */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-emerald-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                  <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-rose-400 rounded-full -translate-x-1/2 translate-y-1/2 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-center">AI Analyzing Performance</h3>
              <p className="text-white/50 text-center text-sm max-w-[250px]">
                Reviewing your past scores to create the perfect workout...
              </p>
            </motion.div>
          )}

          {/* Plan State */}
          {step === 'plan' && (
            <motion.div 
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col px-6 py-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Your Workout</h3>
                  <p className="text-white/50 text-sm">Tailored to improve your weak spots</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {WORKOUT_PLAN.map((game, index) => (
                  <motion.button 
                    key={game.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setCurrentGameIndex(index);
                      setStep('playing');
                    }}
                    className="w-full text-left bg-[#1a1a1c] border border-white/5 rounded-3xl p-5 flex items-center gap-4 relative overflow-hidden hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 ${game.color.replace('text-', 'bg-')}/10 rounded-full blur-2xl -mr-10 -mt-10`} />
                    <div className={`w-12 h-12 rounded-2xl bg-[#0a0a0c] border border-white/5 flex items-center justify-center ${game.color} relative z-10`}>
                      {game.icon}
                    </div>
                    <div className="flex-1 relative z-10">
                      <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Round {index + 1}</p>
                      <h4 className="font-bold text-lg leading-tight">{game.name}</h4>
                    </div>
                    <div className="relative z-10 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      <span className="text-xs font-medium capitalize">{game.difficulty}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => {
                  setCurrentGameIndex(0);
                  setStep('playing');
                }}
                className="w-full bg-indigo-500 text-white rounded-2xl p-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors mt-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
              >
                Start Workout <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Playing State */}
          {step === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 z-50 bg-[#0a0a0c]"
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-50">
                <motion.div 
                  className="h-full bg-indigo-500"
                  initial={{ width: `${(currentGameIndex / WORKOUT_PLAN.length) * 100}%` }}
                  animate={{ width: `${((currentGameIndex) / WORKOUT_PLAN.length) * 100}%` }}
                />
              </div>

              {WORKOUT_PLAN[currentGameIndex].type === 'memory' ? (
                <MemoryGridGame 
                  onBack={onBack} 
                  trainingMode={true} 
                  trainingDifficulty={WORKOUT_PLAN[currentGameIndex].difficulty}
                  onTrainingComplete={handleGameComplete}
                />
              ) : (
                <ReactionSpeedGame 
                  onBack={onBack} 
                  trainingMode={true} 
                  trainingDifficulty={WORKOUT_PLAN[currentGameIndex].difficulty}
                  onTrainingComplete={handleGameComplete}
                />
              )}
            </motion.div>
          )}

          {/* Summary State */}
          {step === 'summary' && (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30 relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                <Trophy className="w-12 h-12 text-emerald-400 relative z-10" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-center">Workout Complete!</h3>
              <p className="text-white/50 text-center mb-8">
                Great job! Your brain is sharper today.
              </p>

              <div className="bg-[#1a1a1c] rounded-3xl p-6 w-full mb-8 border border-white/5 text-center">
                <p className="text-white/50 text-sm font-medium mb-1">Total Score</p>
                <p className="text-5xl font-bold text-emerald-400 mb-6">{totalScore}</p>
                
                <div className="space-y-3 border-t border-white/5 pt-6 text-left">
                  {WORKOUT_PLAN.map((game, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">{game.name}</span>
                      <span className="font-bold">{scores[idx]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (onWorkoutComplete) onWorkoutComplete(totalScore);
                  onBack();
                }}
                className="w-full bg-emerald-500 text-white rounded-2xl p-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle className="w-5 h-5" /> Finish
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
