import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, CheckCircle, ArrowRight, Activity, Zap, Target, ArrowLeft, Trophy } from 'lucide-react';
import MemoryGridGame from '@/src/features/memory/components/MemoryGridGame';
import ReactionSpeedGame from '@/src/features/reaction/components/ReactionSpeedGame';

type TrainingStep = 'playing' | 'summary';

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
  const [step, setStep] = useState<TrainingStep>('playing');
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

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
