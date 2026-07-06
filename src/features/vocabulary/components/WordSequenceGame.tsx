import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, ListOrdered, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface WordSequenceGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
  gameType?: 'sequence' | 'pattern';
}

export default function WordSequenceGame({ onBack, onGameComplete, gameType = 'sequence', difficulty = 'easy' }: WordSequenceGameProps) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [sequence, setSequence] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const generateSequence = () => {
    if (gameType === 'sequence') {
      // Letter sequence (e.g., A, C, E, G, ?)
      const startCode = 65 + Math.floor(Math.random() * 10); // A-J
      const step = Math.floor(Math.random() * 3) + 1; // 1-3
      const length = 4;
      
      const seq = [];
      for (let i = 0; i < length; i++) {
        seq.push(String.fromCharCode(startCode + i * step));
      }
      
      const answer = String.fromCharCode(startCode + length * step);
      setSequence(seq);
      setCorrectAnswer(answer);
      
      // Generate options
      const opts = new Set<string>([answer]);
      while(opts.size < 4) {
        opts.add(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
      }
      setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
      
    } else {
      // Word pattern (e.g., CAT, BAT, RAT, ?)
      const patterns = [
        { seq: ['CAT', 'BAT', 'RAT'], ans: 'MAT', wrong: ['DOG', 'CAR', 'SIT'] },
        { seq: ['SUN', 'BUN', 'FUN'], ans: 'RUN', wrong: ['MAN', 'PEN', 'HOT'] },
        { seq: ['SING', 'RING', 'WING'], ans: 'KING', wrong: ['SONG', 'BIRD', 'FLY'] },
        { seq: ['TALL', 'FALL', 'CALL'], ans: 'BALL', wrong: ['WALK', 'TALK', 'JUMP'] },
        { seq: ['LIGHT', 'NIGHT', 'RIGHT'], ans: 'SIGHT', wrong: ['DARK', 'DAY', 'LEFT'] }
      ];
      
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      setSequence(pattern.seq);
      setCorrectAnswer(pattern.ans);
      
      const opts = [pattern.ans, ...pattern.wrong].sort(() => Math.random() - 0.5);
      setOptions(opts);
    }
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setGameState('playing');
    generateSequence();
  };

  const endGame = () => {
    setGameState('gameover');
    if (onGameComplete) {
      onGameComplete(score, level);
    }
  };

  const handleOptionClick = (option: string) => {
    if (option === correctAnswer) {
      setScore(prev => prev + 15);
      setLevel(prev => prev + 1);
      setTimeLeft(prev => prev + 3);
      generateSequence();
    } else {
      setTimeLeft(prev => Math.max(0, prev - 5));
    }
  };

  const getIcon = () => {
    return gameType === 'sequence' ? <ListOrdered className="w-6 h-6 text-amber-400" /> : <Activity className="w-6 h-6 text-rose-400" />;
  };

  const getTitle = () => {
    return gameType === 'sequence' ? 'Letter Sequence' : 'Word Pattern';
  };

  const getColor = () => {
    return gameType === 'sequence' ? 'amber' : 'rose';
  };

  const colorClass = `text-${getColor()}-400`;
  const bgClass = `bg-${getColor()}-500`;
  const hoverBgClass = `hover:bg-${getColor()}-600`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="p-4 flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <button onClick={onBack} className="p-2 hover:bg-slate-700/50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          {getIcon()}
          <h1 className="text-xl font-bold">{getTitle()}</h1>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState === 'start' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className={`w-20 h-20 bg-${getColor()}-500/20 rounded-full flex items-center justify-center mx-auto mb-6`}>
              {React.cloneElement(getIcon() as React.ReactElement, { className: `w-10 h-10 ${colorClass}` })}
            </div>
            <h2 className="text-2xl font-bold mb-4">{getTitle()}</h2>
            <p className="text-slate-400 mb-8">Find the next item in the sequence or pattern.</p>
            <button onClick={startGame} className={`w-full py-4 ${bgClass} ${hoverBgClass} text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2`}>
              <Play className="w-6 h-6" /> Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-2xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-12 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Score</p>
                <p className={`text-2xl font-bold ${colorClass}`}>{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Level</p>
                <p className="text-2xl font-bold text-white">{level}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Time</p>
                <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-16">
              {/* Sequence Display */}
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                {sequence.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 md:gap-6">
                    <div className="text-3xl md:text-5xl font-bold text-white bg-slate-800 px-6 py-4 rounded-xl border border-slate-700">
                      {item}
                    </div>
                    <div className="text-2xl text-slate-500 font-bold">→</div>
                  </div>
                ))}
                <div className={`text-3xl md:text-5xl font-bold ${colorClass} bg-slate-800/50 px-6 py-4 rounded-xl border-2 border-dashed border-slate-600`}>
                  ?
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {options.map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    className="py-6 rounded-xl bg-slate-800 border-2 border-slate-700 text-2xl font-bold text-white hover:bg-slate-700 hover:border-slate-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full">
            <div className={`w-20 h-20 bg-${getColor()}-500/20 rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Trophy className={`w-10 h-10 ${colorClass}`} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
            <p className="text-slate-400 mb-6">You reached level {level}</p>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-8">
              <p className="text-sm text-slate-400 mb-1">Final Score</p>
              <p className={`text-4xl font-bold ${colorClass}`}>{score}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={onBack} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">Menu</button>
              <button onClick={startGame} className={`flex-1 py-4 ${bgClass} ${hoverBgClass} text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2`}>
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
