import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {  ArrowLeft, Activity, Play, RotateCcw, Trophy, Heart  } from 'lucide-react';
import GameMenu from './GameMenu';

type GameState = 'menu' | 'playing' | 'gameover';

interface SpeedCircleGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
}

interface Circle {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  duration: number;
}

export default function SpeedCircleGame({ onBack, onGameComplete }: SpeedCircleGameProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [circles, setCircles] = useState<Circle[]>([]);
  
  const gameLoopRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);
  const spawnRateRef = useRef<number>(1500);
  const circleDurationRef = useRef<number>(2500);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setCircles([]);
    spawnRateRef.current = 1500;
    circleDurationRef.current = 2500;
    lastSpawnRef.current = performance.now();
    setGameState('playing');
  };

  const handleCircleTap = (id: number) => {
    setCircles(prev => prev.filter(c => c.id !== id));
    setScore(s => s + 10);
    
    // Increase difficulty
    spawnRateRef.current = Math.max(400, spawnRateRef.current * 0.98);
    circleDurationRef.current = Math.max(800, circleDurationRef.current * 0.98);
  };

  const gameLoop = useCallback((time: number) => {
    if (gameState !== 'playing') return;

    let shouldUpdateCircles = false;
    let missedCount = 0;
    let newCircle: Circle | null = null;

    // Check for missed circles
    setCircles(prev => {
      const remaining = prev.filter(c => time - c.createdAt < c.duration);
      missedCount = prev.length - remaining.length;
      
      if (missedCount > 0) {
        shouldUpdateCircles = true;
      }

      // Spawn new circles
      if (time - lastSpawnRef.current > spawnRateRef.current) {
        lastSpawnRef.current = time;
        newCircle = {
          id: time,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          createdAt: time,
          duration: circleDurationRef.current
        };
        shouldUpdateCircles = true;
      }

      if (shouldUpdateCircles) {
        if (missedCount > 0) {
          setLives(l => {
            const newLives = l - missedCount;
            if (newLives <= 0) {
              setGameState('gameover');
              if (onGameComplete) onGameComplete(score, 1);
            }
            return newLives;
          });
        }
        return newCircle ? [...remaining, newCircle] : remaining;
      }
      return prev;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, score, onGameComplete]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, gameLoop]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <span className="font-bold text-lg">Speed Circle</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <GameMenu
              title="Speed Circle"
              description="Tap the circles before they shrink and disappear. Don't miss!"
              icon={<Activity className="w-14 h-14 text-purple-400" />}
              iconBgColor="bg-purple-500/20"
              iconColor="text-purple-400"
              onStart={startGame}
              onBack={onBack}
              showDifficulty={false}
            />
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart key={i} className={`w-6 h-6 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-white/20'}`} />
                  ))}
                </div>
                <div className="text-2xl font-bold text-white">{score}</div>
              </div>

              {circles.map(circle => (
                <motion.div
                  key={circle.id}
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: 0, opacity: 1 }}
                  transition={{ duration: circle.duration / 1000, ease: "linear" }}
                  onPointerDown={() => handleCircleTap(circle.id)}
                  className="absolute w-20 h-20 rounded-full bg-purple-500/80 border-4 border-purple-400 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                  style={{
                    left: `${circle.x}%`,
                    top: `${circle.y}%`,
                    transform: 'translate(-50%, -50%)',
                    touchAction: 'none'
                  }}
                />
              ))}
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full z-10">
              <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
              <p className="text-white/60 mb-8">You missed too many circles.</p>
              <div className="bg-[#1a1a1c] rounded-3xl p-6 mb-8 border border-white/5">
                <span className="text-white/50 text-sm font-bold uppercase tracking-wider block mb-2">Final Score</span>
                <span className="text-5xl font-bold text-purple-400">{score}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors">
                  Menu
                </button>
                <button onClick={startGame} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                  <RotateCcw className="w-5 h-5" /> Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
