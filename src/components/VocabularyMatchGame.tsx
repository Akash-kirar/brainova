import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, BookOpen, Link, Copy } from 'lucide-react';
import { motion } from 'motion/react';

interface VocabularyMatchGameProps {
  onBack: () => void;
  onGameComplete?: (score: number, maxLevel: number) => void;
  gameType?: 'vocabulary' | 'synonym' | 'association';
}

const WORD_PAIRS = {
  vocabulary: [
    { word: 'Ephemeral', match: 'Short-lived' },
    { word: 'Ubiquitous', match: 'Everywhere' },
    { word: 'Pragmatic', match: 'Practical' },
    { word: 'Eloquent', match: 'Articulate' },
    { word: 'Lucid', match: 'Clear' },
    { word: 'Meticulous', match: 'Careful' },
    { word: 'Resilient', match: 'Tough' },
    { word: 'Candid', match: 'Honest' },
    { word: 'Obscure', match: 'Unclear' },
    { word: 'Profound', match: 'Deep' }
  ],
  synonym: [
    { word: 'Happy', match: 'Joyful' },
    { word: 'Fast', match: 'Quick' },
    { word: 'Smart', match: 'Intelligent' },
    { word: 'Big', match: 'Large' },
    { word: 'Small', match: 'Tiny' },
    { word: 'Angry', match: 'Furious' },
    { word: 'Sad', match: 'Sorrowful' },
    { word: 'Brave', match: 'Courageous' },
    { word: 'Calm', match: 'Peaceful' },
    { word: 'Rich', match: 'Wealthy' }
  ],
  association: [
    { word: 'Coffee', match: 'Morning' },
    { word: 'Ocean', match: 'Wave' },
    { word: 'Tree', match: 'Leaf' },
    { word: 'Book', match: 'Read' },
    { word: 'Pen', match: 'Write' },
    { word: 'Sun', match: 'Heat' },
    { word: 'Moon', match: 'Night' },
    { word: 'Car', match: 'Drive' },
    { word: 'Bird', match: 'Fly' },
    { word: 'Fish', match: 'Swim' }
  ]
};

export default function VocabularyMatchGame({ onBack, onGameComplete, gameType = 'vocabulary' }: VocabularyMatchGameProps) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [leftItems, setLeftItems] = useState<{id: string, text: string}[]>([]);
  const [rightItems, setRightItems] = useState<{id: string, text: string}[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const generatePairs = () => {
    const list = WORD_PAIRS[gameType];
    const pairCount = Math.min(3 + Math.floor(level / 2), 6); // 3 to 6 pairs
    
    // Select random pairs
    const shuffledList = [...list].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffledList.slice(0, pairCount);
    
    const left = selectedPairs.map(p => ({ id: p.word, text: p.word }));
    const right = selectedPairs.map(p => ({ id: p.word, text: p.match }));
    
    setLeftItems(left.sort(() => Math.random() - 0.5));
    setRightItems(right.sort(() => Math.random() - 0.5));
    setMatchedPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setGameState('playing');
    generatePairs();
  };

  const endGame = () => {
    setGameState('gameover');
    if (onGameComplete) {
      onGameComplete(score, level);
    }
  };

  const handleSelect = (side: 'left' | 'right', id: string) => {
    if (matchedPairs.includes(id)) return;

    if (side === 'left') {
      setSelectedLeft(id === selectedLeft ? null : id);
    } else {
      setSelectedRight(id === selectedRight ? null : id);
    }
  };

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        // Match!
        setMatchedPairs(prev => [...prev, selectedLeft]);
        setScore(prev => prev + 20);
        setSelectedLeft(null);
        setSelectedRight(null);
        
        // Check if level complete
        if (matchedPairs.length + 1 === leftItems.length) {
          setTimeout(() => {
            setLevel(prev => prev + 1);
            setTimeLeft(prev => prev + 10);
            generatePairs();
          }, 500);
        }
      } else {
        // No match
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
      }
    }
  }, [selectedLeft, selectedRight]);

  const getIcon = () => {
    switch (gameType) {
      case 'synonym': return <Copy className="w-6 h-6 text-indigo-400" />;
      case 'association': return <Link className="w-6 h-6 text-yellow-400" />;
      default: return <BookOpen className="w-6 h-6 text-emerald-400" />;
    }
  };

  const getTitle = () => {
    switch (gameType) {
      case 'synonym': return 'Synonym Match';
      case 'association': return 'Word Association';
      default: return 'Vocabulary Match';
    }
  };

  const getColor = () => {
    switch (gameType) {
      case 'synonym': return 'indigo';
      case 'association': return 'yellow';
      default: return 'emerald';
    }
  };

  const colorClass = `text-${getColor()}-400`;
  const bgClass = `bg-${getColor()}-500`;
  const hoverBgClass = `hover:bg-${getColor()}-600`;
  const borderClass = `border-${getColor()}-400`;

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
            <p className="text-slate-400 mb-8">Match the words on the left with their correct pairs on the right.</p>
            <button onClick={startGame} className={`w-full py-4 ${bgClass} ${hoverBgClass} text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2`}>
              <Play className="w-6 h-6" /> Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-4xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
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

            <div className="flex-1 grid grid-cols-2 gap-4 md:gap-8">
              {/* Left Column */}
              <div className="flex flex-col gap-3">
                {leftItems.map((item) => {
                  const isMatched = matchedPairs.includes(item.id);
                  const isSelected = selectedLeft === item.id;
                  return (
                    <motion.button
                      key={`left-${item.id}`}
                      onClick={() => handleSelect('left', item.id)}
                      disabled={isMatched}
                      className={`p-4 rounded-xl text-center font-bold text-lg md:text-xl transition-all border-2 ${
                        isMatched ? 'bg-slate-800/50 border-slate-700/50 text-slate-600 opacity-50' :
                        isSelected ? `bg-${getColor()}-500/20 ${borderClass} text-white shadow-[0_0_15px_rgba(var(--color-${getColor()}-500),0.3)]` :
                        'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
                      }`}
                      whileHover={!isMatched && !isSelected ? { scale: 1.02 } : {}}
                      whileTap={!isMatched ? { scale: 0.98 } : {}}
                    >
                      {item.text}
                    </motion.button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-3">
                {rightItems.map((item) => {
                  const isMatched = matchedPairs.includes(item.id);
                  const isSelected = selectedRight === item.id;
                  return (
                    <motion.button
                      key={`right-${item.id}`}
                      onClick={() => handleSelect('right', item.id)}
                      disabled={isMatched}
                      className={`p-4 rounded-xl text-center font-bold text-lg md:text-xl transition-all border-2 ${
                        isMatched ? 'bg-slate-800/50 border-slate-700/50 text-slate-600 opacity-50' :
                        isSelected ? `bg-${getColor()}-500/20 ${borderClass} text-white shadow-[0_0_15px_rgba(var(--color-${getColor()}-500),0.3)]` :
                        'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
                      }`}
                      whileHover={!isMatched && !isSelected ? { scale: 1.02 } : {}}
                      whileTap={!isMatched ? { scale: 0.98 } : {}}
                    >
                      {item.text}
                    </motion.button>
                  );
                })}
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
