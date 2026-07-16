import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Zap, Play, RotateCcw, Trophy, Target } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'menu' | 'playing' | 'gameover';

interface ReactionSpeedGameProps {
  onBack: () => void;
  trainingMode?: boolean;
  trainingDifficulty?: Difficulty;
  onTrainingComplete?: (score: number) => void;
  onGameComplete?: (score: number, reactionTime: number) => void;
}

const DIFFICULTY_SETTINGS = {
  easy: { size: 80, duration: 2000, color: 'bg-emerald-400', shadow: 'shadow-[0_0_20px_rgba(52,211,153,0.4)]' },
  medium: { size: 60, duration: 1200, color: 'bg-amber-400', shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]' },
  hard: { size: 45, duration: 800, color: 'bg-rose-400', shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]' },
};

export default function ReactionSpeedGame({ onBack, trainingMode, trainingDifficulty, onTrainingComplete, onGameComplete }: ReactionSpeedGameProps) {
  const [gameState, setGameState] = useState<GameState>(trainingMode ? 'playing' : 'menu');
  const [difficulty, setDifficulty] = useState<Difficulty>(trainingDifficulty || 'easy');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastReaction, setLastReaction] = useState<number | null>(null);
  
  const [target, setTarget] = useState<{ id: number; x: number; y: number } | null>(null);
  const [stats, setStats] = useState({ hits: 0, misses: 0, totalReactionTime: 0 });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimeRef = useRef<number>(0);

  const settings = DIFFICULTY_SETTINGS[difficulty];

  const spawnTarget = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const now = Date.now();
    spawnTimeRef.current = now;
    
    // Keep within 15% to 85% to avoid clipping the edges
    setTarget({
      id: now,
      x: Math.floor(Math.random() * 70) + 15,
      y: Math.floor(Math.random() * 70) + 15
    });

    timeoutRef.current = setTimeout(() => {
      setStats(s => ({ ...s, misses: s.misses + 1 }));
      setLastReaction(null);
      // Spawn next target after miss
      spawnTarget();
    }, DIFFICULTY_SETTINGS[difficulty].duration);
  }, [difficulty]);

  const startGame = (selectedDiff: Difficulty) => {
    setDifficulty(selectedDiff);
    setScore(0);
    setStats({ hits: 0, misses: 0, totalReactionTime: 0 });
    setLastReaction(null);
    setTimeLeft(30);
    setGameState('playing');
  };

  useEffect(() => {
    if (trainingMode && trainingDifficulty) {
      startGame(trainingDifficulty);
    }
  }, [trainingMode, trainingDifficulty]);

  // Handle playing timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('gameover');
      setTarget(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [gameState, timeLeft]);

  // Start spawning when playing starts
  useEffect(() => {
    if (gameState === 'playing') {
      spawnTarget();
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [gameState, spawnTarget]);

  useEffect(() => {
    if (gameState === 'gameover') {
      const avgReaction = stats.hits > 0 ? Math.floor(stats.totalReactionTime / stats.hits) : 0;
      if (trainingMode && onTrainingComplete) {
        onTrainingComplete(score);
      }
      if (onGameComplete) {
        onGameComplete(score, avgReaction);
      }
    }
  }, [gameState, score, stats, trainingMode, onTrainingComplete, onGameComplete]);

  const handleTargetClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (gameState !== 'playing' || target?.id !== id) return;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const reaction = Date.now() - spawnTimeRef.current;
    
    // Score calculation: faster = more points. Max 1000 per hit.
    const points = Math.max(10, Math.floor(1000 - reaction));
    
    setScore(s => s + points);
    setStats(s => ({
      ...s,
      hits: s.hits + 1,
      totalReactionTime: s.totalReactionTime + reaction
    }));
    setLastReaction(reaction);

    spawnTarget();
  };

  const handleMissClick = () => {
    if (gameState !== 'playing') return;
    setStats(s => ({ ...s, misses: s.misses + 1 }));
    setScore(s => Math.max(0, s - 50)); // Penalty for random tapping
  };

  const avgReaction = stats.hits > 0 ? Math.round(stats.totalReactionTime / stats.hits) : 0;
  const accuracy = (stats.hits + stats.misses) > 0 
    ? Math.round((stats.hits / (stats.hits + stats.misses)) * 100) 
    : 0;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Reaction Speed</h2>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* Menu State */}
          {gameState === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              <div className="w-24 h-24 bg-rose-500/20 rounded-3xl flex items-center justify-center mb-8 border border-rose-500/30">
                <Zap className="w-12 h-12 text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Select Difficulty</h3>
              <p className="text-white/50 text-center mb-10 text-sm">
                Tap the targets as fast as possible before they disappear.
              </p>

              <div className="w-full space-y-4">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => startGame(diff)}
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-[#2a2a2c] transition-colors group"
                  >
                    <span className="capitalize font-semibold text-lg">{diff}</span>
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors text-rose-400">
                      <Play className="w-5 h-5 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Playing State */}
          {gameState === 'playing' && (
            <motion.div 
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* HUD */}
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold text-lg">{timeLeft}s</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Target className="w-5 h-5" />
                    <span className="font-bold text-lg">{stats.hits}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl leading-none">{score}</p>
                </div>
              </div>

              {/* Play Area */}
              <div 
                className="flex-1 relative bg-[#1a1a1c]/50 mx-4 mb-4 rounded-3xl border border-white/5 overflow-hidden"
                onClick={handleMissClick}
              >
                {/* Last Reaction Indicator */}
                {lastReaction !== null && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/30 text-sm font-mono pointer-events-none">
                    {lastReaction}ms
                  </div>
                )}

                <AnimatePresence>
                  {target && (
                    <motion.button
                      key={target.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleTargetClick(e, target.id)}
                      className={`absolute rounded-full ${settings.color} ${settings.shadow} flex items-center justify-center`}
                      style={{
                        width: settings.size,
                        height: settings.size,
                        left: `calc(${target.x}% - ${settings.size / 2}px)`,
                        top: `calc(${target.y}% - ${settings.size / 2}px)`,
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Game Over State */}
          {gameState === 'gameover' && (
            <motion.div 
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center mb-6 border border-rose-500/30">
                <Trophy className="w-12 h-12 text-rose-400" />
              </div>
              <h3 className="text-3xl font-bold mb-8">Time's Up!</h3>

              <div className="bg-[#1a1a1c] rounded-3xl p-6 w-full mb-4 border border-white/5 text-center">
                <p className="text-white/50 text-sm font-medium mb-1">Final Score</p>
                <p className="text-5xl font-bold text-rose-400 mb-6">{score}</p>
                
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Avg Reaction</p>
                    <p className="text-xl font-bold">{avgReaction}ms</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Accuracy</p>
                    <p className="text-xl font-bold">{accuracy}%</p>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-4 mt-4">
                {trainingMode && onTrainingComplete ? (
                  <button
                    onClick={() => onTrainingComplete(score)}
                    className="w-full bg-rose-500 text-white rounded-2xl p-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors"
                  >
                    Continue Training
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startGame(difficulty)}
                      className="w-full bg-rose-500 text-white rounded-2xl p-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" /> Play Again
                    </button>
                    <button
                      onClick={() => setGameState('menu')}
                      className="w-full bg-[#1a1a1c] text-white rounded-2xl p-4 font-bold text-lg hover:bg-[#2a2a2c] transition-colors border border-white/5"
                    >
                      Change Difficulty
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
