import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface GameDetailsViewProps {
  game: {
    id: string;
    title: string;
    category: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  };
  onClose: () => void;
  onPlay: (difficulty: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function GameDetailsView({ 
  game, 
  onClose, 
  onPlay,
  isFavorite = false,
  onToggleFavorite
}: GameDetailsViewProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Placeholder stats
  const stats = {
    bestScore: '1250',
    avgScore: '980',
    accuracy: '92%'
  };

  const difficultyLevel = {
    easy: 'Level 4 • Easy',
    medium: 'Level 7 • Medium',
    hard: 'Level 10 • Hard'
  }[difficulty];

  // Helper to extract the color without the /10 opacity, if applicable
  const baseColorClass = game.color.replace('/10', '/20');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed inset-0 bg-[#070710] z-50 flex flex-col"
    >
      {/* Background ambient glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2 relative z-10">
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-start hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-wide">Game Details</h1>
        <button className="w-10 h-10 flex items-center justify-end hover:opacity-70 transition-opacity">
          <MoreVertical className="w-5 h-5 text-white/80" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 hide-scrollbar relative z-10">
        {/* Game Icon */}
        <div className="flex justify-center mt-8 mb-10">
          <div className={`relative w-48 h-48 rounded-full ${baseColorClass} flex items-center justify-center`}>
            {/* Inner concentric rings */}
            <div className="absolute inset-4 rounded-full border-[12px] border-black/10" />
            <div className="absolute inset-10 rounded-full border-[12px] border-black/10" />
            <div className="absolute inset-16 rounded-full bg-black/10" />
            
            {/* The icon itself, scaled up */}
            <div className="scale-[4]">
              {game.icon}
            </div>
          </div>
        </div>

        {/* Title and Category */}
        <div className="text-center mb-5">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{game.title}</h2>
          <p className="text-[15px] text-white/50">{game.category}</p>
        </div>

        {/* Level Indicator */}
        <div className="bg-[#0b1e15] border border-[#059669]/30 rounded-2xl py-3.5 px-4 mb-6 max-w-sm mx-auto">
          <p className="text-center text-[#10b981] font-bold text-sm tracking-wide">
            {difficultyLevel}
          </p>
        </div>

        {/* Description */}
        <p className="text-center text-[14px] text-white/60 mb-6 max-w-sm mx-auto">
          {game.description || `Train your ${game.category.toLowerCase()} skills with this interactive challenge.`}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-[#111116] border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] text-white/40 mb-1">Best Score</span>
            <span className="text-xl font-bold text-white tracking-tight">{stats.bestScore}</span>
          </div>
          <div className="bg-[#111116] border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] text-white/40 mb-1">Avg. Score</span>
            <span className="text-xl font-bold text-white tracking-tight">{stats.avgScore}</span>
          </div>
          <div className="bg-[#111116] border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] text-white/40 mb-1">Accuracy</span>
            <span className="text-xl font-bold text-white tracking-tight">{stats.accuracy}</span>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-4">
          <h3 className="text-[17px] font-bold text-white mb-4">Select Difficulty</h3>
          <div className="flex gap-3">
            <button 
              onClick={() => setDifficulty('easy')}
              className={`flex-1 py-4 rounded-2xl font-bold text-[14px] transition-all ${
                difficulty === 'easy' 
                  ? 'bg-[#22c55e] text-black' 
                  : 'bg-[#14141c] text-white/60 hover:bg-[#1a1a24]'
              }`}
            >
              Easy
            </button>
            <button 
              onClick={() => setDifficulty('medium')}
              className={`flex-1 py-4 rounded-2xl font-bold text-[14px] transition-all ${
                difficulty === 'medium' 
                  ? 'bg-[#3b82f6] text-black' 
                  : 'bg-[#14141c] text-white/60 hover:bg-[#1a1a24]'
              }`}
            >
              Medium
            </button>
            <button 
              onClick={() => setDifficulty('hard')}
              className={`flex-1 py-4 rounded-2xl font-bold text-[14px] transition-all ${
                difficulty === 'hard' 
                  ? 'bg-[#ef4444] text-black' 
                  : 'bg-[#14141c] text-white/60 hover:bg-[#1a1a24]'
              }`}
            >
              Hard
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#070710] via-[#070710] to-transparent z-20">
        <div className="flex gap-4">
          <button 
            onClick={() => onPlay(difficulty)}
            className="flex-1 bg-gradient-to-r from-[#ff6b2b] via-[#ec4899] to-[#8b5cf6] text-white font-bold text-lg py-4 rounded-2xl shadow-[0_4px_20px_rgba(236,72,153,0.3)] hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Play Now
          </button>
          <button 
            onClick={onToggleFavorite}
            className={`w-[60px] h-[60px] flex-shrink-0 flex items-center justify-center rounded-2xl ${
              isFavorite 
                ? 'bg-[#1a1a24] text-yellow-400' 
                : 'bg-[#14141c] text-white/50 hover:bg-[#1a1a24]'
            } transition-colors`}
          >
            <Star className={`w-6 h-6 ${isFavorite ? 'fill-yellow-400' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
