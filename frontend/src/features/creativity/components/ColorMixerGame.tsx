import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap, Palette } from 'lucide-react';

interface ColorMixerGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function ColorMixerGame({ onBack, onGameComplete, difficulty }: ColorMixerGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [targetColor, setTargetColor] = useState({ r: 0, g: 0, b: 0 });
  const [myColor, setMyColor] = useState({ r: 128, g: 128, b: 128 });

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
    setTargetColor({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    });
    setMyColor({ r: 128, g: 128, b: 128 });
  };

  const handleMix = () => {
    if (gameState !== 'playing') return;
    
    const diffR = Math.abs(targetColor.r - myColor.r);
    const diffG = Math.abs(targetColor.g - myColor.g);
    const diffB = Math.abs(targetColor.b - myColor.b);
    
    const totalDiff = diffR + diffG + diffB;
    const maxDiff = 255 * 3;
    const matchPercentage = 100 - (totalDiff / maxDiff) * 100;
    
    // Tolerance gets stricter
    const tolerance = Math.max(80, 95 - level * 2);
    
    if (matchPercentage >= tolerance) {
      setScore(s => s + 20 * level);
      setLevel(l => l + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 10));
    }
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
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
          <div className="w-full max-w-md flex flex-col items-center gap-8">
            <h2 className="text-2xl font-bold mb-4">Match the Color</h2>
            
            <div className="flex w-full gap-8 justify-center">
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/20 shadow-lg"
                  style={{ backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` }}
                />
                <span className="text-white/60 font-bold">Target</span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/50 shadow-lg"
                  style={{ backgroundColor: `rgb(${myColor.r}, ${myColor.g}, ${myColor.b})` }}
                />
                <span className="text-white font-bold">Yours</span>
              </div>
            </div>
            
            <div className="w-full space-y-6 mt-8">
              <div className="flex items-center gap-4">
                <span className="text-red-500 font-bold w-4">R</span>
                <input 
                  type="range" 
                  min="0" max="255" 
                  value={myColor.r} 
                  onChange={(e) => setMyColor({...myColor, r: parseInt(e.target.value)})}
                  className="flex-1 h-2 bg-red-900 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-green-500 font-bold w-4">G</span>
                <input 
                  type="range" 
                  min="0" max="255" 
                  value={myColor.g} 
                  onChange={(e) => setMyColor({...myColor, g: parseInt(e.target.value)})}
                  className="flex-1 h-2 bg-green-900 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-blue-500 font-bold w-4">B</span>
                <input 
                  type="range" 
                  min="0" max="255" 
                  value={myColor.b} 
                  onChange={(e) => setMyColor({...myColor, b: parseInt(e.target.value)})}
                  className="flex-1 h-2 bg-blue-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
            
            <button
              onClick={handleMix}
              className="mt-8 px-12 py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold text-xl rounded-full hover:scale-105 transition-transform"
            >
              Mix!
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
