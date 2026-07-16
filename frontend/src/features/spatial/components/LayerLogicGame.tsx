import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap, Plus, Equal } from 'lucide-react';

interface LayerLogicGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function LayerLogicGame({ onBack, onGameComplete, difficulty }: LayerLogicGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [gridSize, setGridSize] = useState(3);
  const [gridA, setGridA] = useState<boolean[]>([]);
  const [gridB, setGridB] = useState<boolean[]>([]);
  const [options, setOptions] = useState<boolean[][]>([]);
  const [targetIndex, setTargetIndex] = useState(0);

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
    const newSize = Math.min(3 + Math.floor(level / 4), 4);
    setGridSize(newSize);
    
    const totalCells = newSize * newSize;
    const a = Array(totalCells).fill(false);
    const b = Array(totalCells).fill(false);
    
    // Fill random cells
    for(let i=0; i<totalCells; i++) {
      if(Math.random() > 0.6) a[i] = true;
      if(Math.random() > 0.6) b[i] = true;
    }
    
    // Calculate XOR result
    const result = a.map((val, i) => val !== b[i]); // XOR
    
    setGridA(a);
    setGridB(b);
    
    // Generate options
    const newOptions: boolean[][] = [];
    newOptions.push(result);
    
    while(newOptions.length < 4) {
      const wrong = [...result];
      // Flip 1-2 random cells to make it wrong
      const flips = Math.floor(Math.random() * 2) + 1;
      for(let j=0; j<flips; j++) {
        const idx = Math.floor(Math.random() * totalCells);
        wrong[idx] = !wrong[idx];
      }
      
      // Check if unique
      const isUnique = !newOptions.some(opt => opt.every((val, idx) => val === wrong[idx]));
      if (isUnique) {
        newOptions.push(wrong);
      }
    }
    
    // Shuffle options
    const shuffled = newOptions.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
      
    setOptions(shuffled);
    setTargetIndex(shuffled.findIndex(opt => opt.every((val, idx) => val === result[idx])));
  };

  const handleGuess = (idx: number) => {
    if (gameState !== 'playing') return;
    
    if (idx === targetIndex) {
      setScore(s => s + 15 * level);
      setLevel(l => l + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 5));
    }
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
  };

  const GridRender = ({ grid, clickable, onClick }: { grid: boolean[], clickable?: boolean, onClick?: () => void }) => (
    <div 
      className="grid gap-1 bg-[#1a1a1c] p-2 rounded-xl border border-white/10"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      onClick={clickable ? onClick : undefined}
    >
      {grid.map((isActive, i) => (
        <div 
          key={i} 
          className={`w-6 h-6 sm:w-10 sm:h-10 rounded-sm ${isActive ? 'bg-cyan-500' : 'bg-white/5'} transition-colors`}
        />
      ))}
    </div>
  );

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
          <div className="w-full max-w-2xl flex flex-col items-center gap-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Layer Logic</h2>
              <p className="text-white/60">Overlapping filled cells cancel each other out (XOR)</p>
            </div>
            
            <div className="flex items-center gap-4">
              <GridRender grid={gridA} />
              <Plus className="w-8 h-8 text-white/50" />
              <GridRender grid={gridB} />
              <Equal className="w-8 h-8 text-white/50" />
              <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-white/30">
                ?
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 w-full mt-8">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleGuess(i)}
                  className="flex justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5 hover:border-cyan-500/50"
                >
                  <GridRender grid={opt} />
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
