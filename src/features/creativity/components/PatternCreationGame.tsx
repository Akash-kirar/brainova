import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, Paintbrush } from 'lucide-react';

interface PatternCreationGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function PatternCreationGame({ onBack, onGameComplete }: PatternCreationGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [gridSize, setGridSize] = useState(6);
  const [targetPattern, setTargetPattern] = useState<boolean[]>([]);
  const [userPattern, setUserPattern] = useState<boolean[]>([]);

  const generateLevel = useCallback((currentLevel: number) => {
    const size = Math.min(10, 4 + Math.floor((currentLevel - 1) / 2) * 2); // even numbers 4, 6, 8, 10
    setGridSize(size);
    
    const newTarget = Array(size * size).fill(false);
    const halfWidth = size / 2;
    
    // Fill left half randomly
    let hasBlocks = false;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < halfWidth; c++) {
        if (Math.random() > 0.6) {
          newTarget[r * size + c] = true;
          hasBlocks = true;
        }
      }
    }
    
    // Ensure at least one block
    if (!hasBlocks) {
      newTarget[0] = true;
    }
    
    setTargetPattern(newTarget);
    setUserPattern(Array(size * size).fill(false));
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
    generateLevel(1);
  };

  const handleCellClick = (index: number) => {
    if (feedback !== null) return;
    
    const c = index % gridSize;
    const halfWidth = gridSize / 2;
    
    // Only allow clicking on the right half
    if (c < halfWidth) return;
    
    const newPattern = [...userPattern];
    newPattern[index] = !newPattern[index];
    setUserPattern(newPattern);
    
    checkWin(newPattern);
  };
  
  const checkWin = (currentPattern: boolean[]) => {
    const halfWidth = gridSize / 2;
    let isCorrect = true;
    
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < halfWidth; c++) {
        const leftIdx = r * gridSize + c;
        const rightIdx = r * gridSize + (gridSize - 1 - c);
        
        const expectedVal = targetPattern[leftIdx];
        if (currentPattern[rightIdx] !== expectedVal) {
          isCorrect = false;
          break;
        }
      }
    }
    
    if (isCorrect) {
      setScore(s => s + 20 * level);
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setLevel(l => l + 1);
        generateLevel(level + 1);
      }, 800);
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Pattern Creation</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-pink-500/10 rounded-full flex items-center justify-center mb-6">
            <Paintbrush className="w-12 h-12 text-pink-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Symmetry Drawing</h2>
          <p className="text-white/60 mb-12">
            Look at the pattern on the left and mirror it perfectly on the right side. Tap the empty blocks to draw.
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
          <div className="w-full max-w-md flex flex-col items-center relative">
            <div className="mb-8 text-white/60 text-lg uppercase tracking-widest font-bold">
              Level {level}
            </div>
            
            <div className="relative p-2 bg-white/5 rounded-2xl border border-white/10">
              {/* Divider line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-pink-500/50 -translate-x-1/2 z-10 pointer-events-none rounded-full" />
              
              <div 
                className="grid gap-1"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  width: `${Math.min(320, gridSize * 40)}px`,
                }}
              >
                {Array(gridSize * gridSize).fill(0).map((_, i) => {
                  const r = Math.floor(i / gridSize);
                  const c = i % gridSize;
                  const isLeft = c < gridSize / 2;
                  
                  const isFilled = isLeft ? targetPattern[i] : userPattern[i];
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handleCellClick(i)}
                      disabled={isLeft || feedback !== null}
                      className={`
                        aspect-square rounded-sm flex items-center justify-center transition-all duration-150
                        ${isLeft ? 'cursor-default' : 'cursor-pointer hover:bg-white/20 active:scale-95'}
                        ${isFilled ? 'bg-pink-400' : 'bg-white/10'}
                        ${!isLeft && isFilled ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]' : ''}
                      `}
                    />
                  );
                })}
              </div>
              
              {feedback === 'correct' && (
                <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm z-20">
                  <CheckCircle2 className="w-24 h-24 text-emerald-400" />
                </div>
              )}
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
