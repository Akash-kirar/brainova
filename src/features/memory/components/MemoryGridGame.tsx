import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Heart, Play, RotateCcw, Trophy, Brain } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'menu' | 'showing' | 'playing' | 'gameover';

interface MemoryGridGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  trainingMode?: boolean;
  trainingDifficulty?: Difficulty;
  onTrainingComplete?: (score: number) => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

const DIFFICULTY_SETTINGS = {
  easy: { gridSize: 3, targetCount: 3, showTime: 3000, playTime: 15 },
  medium: { gridSize: 4, targetCount: 5, showTime: 3000, playTime: 20 },
  hard: { gridSize: 5, targetCount: 8, showTime: 4000, playTime: 25 },
};

export default function MemoryGridGame({ onBack, trainingMode, trainingDifficulty, onTrainingComplete, onGameComplete, difficulty: initialDifficulty = 'easy' }: MemoryGridGameProps) {
  const [gameState, setGameState] = useState<GameState>(trainingMode ? 'showing' : 'menu');
  const [difficulty, setDifficulty] = useState<Difficulty>(trainingDifficulty || initialDifficulty as Difficulty);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(initialDifficulty === 'hard' ? 5 : initialDifficulty === 'medium' ? 3 : 1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [targetSquares, setTargetSquares] = useState<number[]>([]);
  const [selectedSquares, setSelectedSquares] = useState<number[]>([]);
  const [wrongSquares, setWrongSquares] = useState<number[]>([]);

  const settings = DIFFICULTY_SETTINGS[difficulty];
  const totalSquares = settings.gridSize * settings.gridSize;

  const generateGrid = useCallback(() => {
    const newTargets: number[] = [];
    while (newTargets.length < settings.targetCount) {
      const randomIdx = Math.floor(Math.random() * totalSquares);
      if (!newTargets.includes(randomIdx)) {
        newTargets.push(randomIdx);
      }
    }
    setTargetSquares(newTargets);
    setSelectedSquares([]);
    setWrongSquares([]);
    setTimeLeft(settings.playTime);
  }, [settings, totalSquares]);

  const startGame = (selectedDiff: Difficulty) => {
    setDifficulty(selectedDiff);
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameState('showing');
  };

  useEffect(() => {
    if (trainingMode && trainingDifficulty) {
      setDifficulty(trainingDifficulty);
      setScore(0);
      setLevel(1);
      setLives(3);
      setGameState('showing');
    }
  }, [trainingMode, trainingDifficulty]);

  const nextLevel = useCallback(() => {
    setLevel(l => l + 1);
    setGameState('showing');
  }, []);

  // Handle showing phase
  useEffect(() => {
    if (gameState === 'showing') {
      generateGrid();
      const timer = setTimeout(() => {
        setGameState('playing');
      }, settings.showTime);
      return () => clearTimeout(timer);
    }
  }, [gameState, generateGrid, settings.showTime]);

  // Handle playing timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('gameover');
      if (trainingMode && onTrainingComplete) onTrainingComplete(score);
      if (onGameComplete) onGameComplete(score, level);
    }
  }, [gameState, timeLeft, score, level, trainingMode, onTrainingComplete, onGameComplete]);

  
  const handleSquareClick = (index: number) => {
    if (gameState !== 'playing') return;
    if (selectedSquares.includes(index) || wrongSquares.includes(index)) return;

    if (targetSquares.includes(index)) {
      const newSelected = [...selectedSquares, index];
      setSelectedSquares(newSelected);
      setScore(s => s + 10 * level);

      if (newSelected.length === targetSquares.length) {
        // Level complete
        setScore(s => s + timeLeft * 5); // Time bonus
        setTimeout(nextLevel, 1000);
      }
    } else {
      const newWrong = [...wrongSquares, index];
      setWrongSquares(newWrong);
      setLives(l => l - 1);
      
      if (lives - 1 <= 0) {
        setGameState('gameover');
      if (trainingMode && onTrainingComplete) onTrainingComplete(score);
      if (onGameComplete) onGameComplete(score, level);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <button onClick={() => {
          if (gameState === 'playing' && onGameComplete) {
            onGameComplete(score, level);
          }
          onBack();
        }} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Memory Matrix</h2>
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
              <div className="w-24 h-24 bg-indigo-500/20 rounded-3xl flex items-center justify-center mb-8 border border-indigo-500/30">
                <Brain className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Select Difficulty</h3>
              <p className="text-white/50 text-center mb-10 text-sm">
                Memorize the highlighted tiles and tap them before time runs out.
              </p>

              <div className="w-full space-y-4">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => startGame(diff)}
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-[#2a2a2c] transition-colors group"
                  >
                    <span className="capitalize font-semibold text-lg">{diff}</span>
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors text-indigo-400">
                      <Play className="w-5 h-5 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Playing / Showing State */}
          {(gameState === 'showing' || gameState === 'playing') && (
            <motion.div 
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col px-6 py-8"
            >
              {/* HUD */}
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <Heart className="w-5 h-5 fill-current" />
                    <span className="font-bold text-lg">{lives}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold text-lg">{timeLeft}s</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Score</p>
                  <p className="font-bold text-2xl leading-none">{score}</p>
                </div>
              </div>

              {/* Status Text */}
              <div className="text-center mb-8 h-8">
                {gameState === 'showing' ? (
                  <p className="text-indigo-400 font-bold animate-pulse">Memorize the pattern...</p>
                ) : (
                  <p className="text-emerald-400 font-bold">Tap the tiles!</p>
                )}
              </div>

              {/* Grid */}
              <div className="flex-1 flex items-center justify-center">
                <div 
                  className="grid gap-3 w-full max-w-[320px] aspect-square"
                  style={{ 
                    gridTemplateColumns: `repeat(${settings.gridSize}, minmax(0, 1fr))` 
                  }}
                >
                  {Array.from({ length: totalSquares }).map((_, i) => {
                    const isTarget = targetSquares.includes(i);
                    const isSelected = selectedSquares.includes(i);
                    const isWrong = wrongSquares.includes(i);
                    
                    let bgColor = 'bg-[#1a1a1c] border-white/5';
                    if (gameState === 'showing' && isTarget) {
                      bgColor = 'bg-indigo-500 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]';
                    } else if (gameState === 'playing') {
                      if (isSelected) bgColor = 'bg-emerald-500 border-emerald-400';
                      else if (isWrong) bgColor = 'bg-rose-500 border-rose-400';
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSquareClick(i)}
                        disabled={gameState !== 'playing'}
                        className={`rounded-xl border-2 transition-all duration-300 ${bgColor} ${
                          gameState === 'playing' && !isSelected && !isWrong ? 'hover:bg-[#2a2a2c] active:scale-95' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 text-center text-white/40 text-sm font-medium">
                Level {level}
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
              <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
                <Trophy className="w-12 h-12 text-amber-400" />
              </div>
              <h3 className="text-3xl font-bold mb-2">Game Over</h3>
              <p className="text-white/50 mb-8">You reached Level {level}</p>

              <div className="bg-[#1a1a1c] rounded-3xl p-6 w-full mb-8 border border-white/5 text-center">
                <p className="text-white/50 text-sm font-medium mb-1">Final Score</p>
                <p className="text-5xl font-bold text-indigo-400">{score}</p>
              </div>

              <div className="w-full space-y-4">
                {trainingMode && onTrainingComplete ? (
                  <button
                    onClick={() => onTrainingComplete(score)}
                    className="w-full bg-indigo-500 text-white rounded-2xl p-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors"
                  >
                    Continue Training
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startGame(difficulty)}
                      className="w-full bg-indigo-500 text-white rounded-2xl p-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" /> Play Again
                    </button>
                    <button
                      onClick={onBack}
                      className="w-full bg-[#1a1a1c] text-white rounded-2xl p-4 font-bold text-lg hover:bg-[#2a2a2c] transition-colors border border-white/5"
                    >
                      Continue
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
