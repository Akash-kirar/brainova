import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Zap, Square, Circle, Triangle, Hexagon } from 'lucide-react';

interface ShapeBuilderGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const SHAPES = [
  { id: 'square', icon: Square },
  { id: 'circle', icon: Circle },
  { id: 'triangle', icon: Triangle },
  { id: 'hexagon', icon: Hexagon },
];

export default function ShapeBuilderGame({ onBack, onGameComplete, difficulty }: ShapeBuilderGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [targetComposition, setTargetComposition] = useState<string[]>([]);
  const [userComposition, setUserComposition] = useState<string[]>([]);

  useEffect(() => {
    generateLevel();
  }, [level]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const generateLevel = () => {
    const numShapes = Math.min(3 + Math.floor(level / 2), 8);
    const newTarget: string[] = [];
    for(let i=0; i<numShapes; i++) {
      newTarget.push(SHAPES[Math.floor(Math.random() * SHAPES.length)].id);
    }
    setTargetComposition(newTarget);
    setUserComposition([]);
  };

  const handleAddShape = (shapeId: string) => {
    if (gameState !== 'playing') return;
    setUserComposition([...userComposition, shapeId]);
  };
  
  const handleRemoveShape = (index: number) => {
    const newComp = [...userComposition];
    newComp.splice(index, 1);
    setUserComposition(newComp);
  };

  const handleSubmit = () => {
    if (gameState !== 'playing') return;
    
    // Check match
    let matchCount = 0;
    const targetCounts: Record<string, number> = {};
    const userCounts: Record<string, number> = {};
    
    targetComposition.forEach(s => { targetCounts[s] = (targetCounts[s] || 0) + 1; });
    userComposition.forEach(s => { userCounts[s] = (userCounts[s] || 0) + 1; });
    
    Object.keys(targetCounts).forEach(s => {
      matchCount += Math.min(targetCounts[s], userCounts[s] || 0);
    });
    
    if (matchCount === targetComposition.length && userComposition.length === targetComposition.length) {
      // Perfect match
      setScore(s => s + 30 * level);
      setTimeLeft(t => Math.min(60, t + 5));
      setLevel(l => l + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 10));
    }
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
  };
  
  const renderShapeList = (composition: string[], isInteractive: boolean) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center p-4 bg-white/5 rounded-xl border border-white/10 min-h-[80px]">
        {composition.map((s, i) => {
          const ShapeIcon = SHAPES.find(shape => shape.id === s)?.icon || Square;
          return (
            <motion.div
              key={`${i}-${s}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`p-3 bg-white/10 rounded-lg ${isInteractive ? 'cursor-pointer hover:bg-red-500/50' : ''}`}
              onClick={() => isInteractive && handleRemoveShape(i)}
            >
              <ShapeIcon className="w-8 h-8" />
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-lg">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-lg">{timeLeft}s</span>
          </div>
          <div className="font-bold text-lg text-white/50">Lvl {level}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {gameState === 'playing' ? (
          <div className="w-full max-w-2xl flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Shape Builder</h2>
              <p className="text-white/60">Match the target composition exactly!</p>
            </div>
            
            <div className="w-full space-y-2">
              <h3 className="text-white/60 font-bold uppercase text-sm tracking-wider">Target Recipe</h3>
              {renderShapeList(targetComposition, false)}
            </div>
            
            <div className="w-full space-y-2">
              <h3 className="text-white/60 font-bold uppercase text-sm tracking-wider">Your Recipe</h3>
              {renderShapeList(userComposition, true)}
            </div>
            
            <div className="flex gap-4 p-4 bg-white/5 rounded-2xl">
              {SHAPES.map(shape => {
                const Icon = shape.icon;
                return (
                  <button
                    key={shape.id}
                    onClick={() => handleAddShape(shape.id)}
                    className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors hover:scale-105"
                  >
                    <Icon className="w-8 h-8" />
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleSubmit}
              className="mt-4 px-12 py-4 bg-emerald-500 text-black font-bold text-xl rounded-full hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Build!
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-8">Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
