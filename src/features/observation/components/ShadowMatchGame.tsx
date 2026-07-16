import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap, Target, Umbrella, Plane, Scissors, Anchor, Bell, Camera, Car, Cloud, Music } from 'lucide-react';

interface ShadowMatchGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const ICONS = [Target, Umbrella, Plane, Scissors, Anchor, Bell, Camera, Car, Cloud, Music];

export default function ShadowMatchGame({ onBack, onGameComplete, difficulty }: ShadowMatchGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [targetIcon, setTargetIcon] = useState<any>(null);
  const [targetRotation, setTargetRotation] = useState(0);
  const [options, setOptions] = useState<{id: number, Icon: any, rotation: number, isCorrect: boolean}[]>([]);

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
    const iconIndex = Math.floor(Math.random() * ICONS.length);
    const selectedIcon = ICONS[iconIndex];
    const correctRotation = Math.floor(Math.random() * 8) * 45; // 0, 45, 90, 135...
    
    setTargetIcon(() => selectedIcon);
    setTargetRotation(correctRotation);
    
    let opts = [];
    opts.push({ id: 0, Icon: selectedIcon, rotation: correctRotation, isCorrect: true });
    
    for (let i = 1; i < 4; i++) {
      let isSameIcon = Math.random() > 0.5;
      let rot = correctRotation;
      while (rot === correctRotation) {
        rot = Math.floor(Math.random() * 8) * 45;
      }
      
      opts.push({
        id: i,
        Icon: isSameIcon ? selectedIcon : ICONS[Math.floor(Math.random() * ICONS.length)],
        rotation: rot,
        isCorrect: false
      });
    }
    
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  const handleOptionClick = (isCorrect: boolean) => {
    if (gameState !== 'playing') return;
    
    if (isCorrect) {
      setScore(s => s + 20 * level);
      setLevel(l => l + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 5));
    }
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
  };

  const TargetComponent = targetIcon;

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
          <div className="w-full max-w-md flex flex-col items-center gap-8">
            <h2 className="text-2xl font-bold text-center">Match the Shadow</h2>
            
            {TargetComponent && (
              <div className="w-32 h-32 bg-white/5 rounded-3xl flex items-center justify-center shadow-lg border border-white/10">
                <TargetComponent 
                  className="w-20 h-20 text-blue-400" 
                  style={{ transform: `rotate(${targetRotation}deg)` }}
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt.isCorrect)}
                  className="aspect-square bg-black border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <opt.Icon 
                    className="w-16 h-16 text-black fill-white/80" 
                    style={{ transform: `rotate(${opt.rotation}deg)` }}
                  />
                </button>
              ))}
            </div>
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