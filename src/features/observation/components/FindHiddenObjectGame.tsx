import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FindHiddenObjectGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function FindHiddenObjectGame({ onBack, onGameComplete }: FindHiddenObjectGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const [objects, setObjects] = useState<{id: number, emoji: string, x: number, y: number, isTarget: boolean, rotation: number, scale: number}[]>([]);
  const [targetEmoji, setTargetEmoji] = useState('');

  const emojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍', '🥝', '🍅', '🍆', '🥑', '🥦', '🥕', '🌽', '🌶️', '🍔', '🍟', '🍕', '🌭', '🌮', '🌯', '🍿', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '☕', '🍵', '🥤', '🧃', '🍺', '🍷', '🥂', '🥃', '🍸', '🍹', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🔪', '🏺'];

  const generateLevel = (currentLevel: number) => {
    const objectCount = Math.min(60, 10 + currentLevel * 5);
    
    // Select a target emoji
    const target = emojis[Math.floor(Math.random() * emojis.length)];
    setTargetEmoji(target);
    
    // Select distractors (making sure target is not among them)
    const availableDistractors = emojis.filter(e => e !== target);
    
    const newObjects = [];
    
    // Create distractors
    for (let i = 0; i < objectCount - 1; i++) {
      newObjects.push({
        id: i,
        emoji: availableDistractors[Math.floor(Math.random() * availableDistractors.length)],
        x: 5 + Math.random() * 90, // 5% to 95%
        y: 5 + Math.random() * 90,
        isTarget: false,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.7 // 0.8 to 1.5
      });
    }
    
    // Create target
    newObjects.push({
      id: objectCount - 1,
      emoji: target,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      isTarget: true,
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.7
    });
    
    // Shuffle
    newObjects.sort(() => Math.random() - 0.5);
    setObjects(newObjects);
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
    setTimeLeft(45);
    setGameState('playing');
    generateLevel(1);
  };

  const handleObjectClick = (isTarget: boolean) => {
    if (feedback !== null) return;
    
    if (isTarget) {
      setScore(s => s + 10 * level);
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setLevel(l => l + 1);
        generateLevel(level + 1);
      }, 500);
    } else {
      setScore(s => Math.max(0, s - 5));
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
      }, 500);
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Find Hidden Object</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Find Hidden Object</h2>
          <p className="text-white/60 mb-12 max-w-sm">
            Scan the crowded area and find the specific target object as quickly as you can.
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

      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {gameState === 'playing' ? (
          <div className="w-full h-full flex flex-col items-center">
            <div className="mb-4 flex items-center gap-4 bg-white/10 px-6 py-3 rounded-full">
              <span className="text-white/60 text-lg">Find this:</span>
              <span className="text-3xl">{targetEmoji}</span>
            </div>
            
            <div className="relative flex-1 w-full max-w-3xl bg-white/5 rounded-3xl overflow-hidden border border-white/10">
              {objects.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => handleObjectClick(obj.isTarget)}
                  className="absolute text-3xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
                  style={{
                    left: `${obj.x}%`,
                    top: `${obj.y}%`,
                    transform: `translate(-50%, -50%) rotate(${obj.rotation}deg) scale(${obj.scale})`,
                    zIndex: obj.isTarget ? 10 : 1
                  }}
                >
                  {obj.emoji}
                </button>
              ))}
              
              {feedback === 'correct' && (
                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-sm z-50">
                  <CheckCircle2 className="w-20 h-20 text-emerald-400" />
                </div>
              )}
              {feedback === 'wrong' && (
                <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center backdrop-blur-sm z-50">
                  <XCircle className="w-20 h-20 text-rose-400" />
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
