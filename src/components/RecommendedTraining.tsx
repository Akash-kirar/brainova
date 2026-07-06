import React from 'react';
import { Grid3X3, Brain, Play, Zap, Sparkles } from 'lucide-react';

interface RecommendedTrainingProps {
  onPlay?: (gameId: string) => void;
}

export default function RecommendedTraining({ onPlay }: RecommendedTrainingProps) {
  const recommendations = [
    { 
      id: 'r1', 
      gameId: 'sudoku-lite', 
      name: 'Sudoku Lite', 
      category: 'Logic', 
      icon: <Grid3X3 className="w-7 h-7 text-[#fbbf24]" strokeWidth={2} />, 
      iconBg: 'bg-[#fbbf24]/10 border border-[#fbbf24]/20' 
    },
    { 
      id: 'r2', 
      gameId: 'pattern-logic', 
      name: 'Pattern Logic', 
      category: 'Logic', 
      icon: <Brain className="w-7 h-7 text-[#a78bfa]" strokeWidth={2} />, 
      iconBg: 'bg-[#a78bfa]/10 border border-[#a78bfa]/20' 
    },
    { 
      id: 'r3', 
      gameId: 'memory-grid', 
      name: 'Memory Grid', 
      category: 'Memory', 
      icon: <Zap className="w-7 h-7 text-[#34d399]" strokeWidth={2} />, 
      iconBg: 'bg-[#34d399]/10 border border-[#34d399]/20' 
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#a855f7]" />
        <h3 className="text-lg font-bold text-white">Ai Recommended Training</h3>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((item) => (
          <div 
            key={item.id}
            onClick={() => onPlay && onPlay(item.gameId)}
            className="flex justify-between items-center bg-[#252528] rounded-2xl p-4 cursor-pointer hover:bg-[#2d2d30] transition-colors shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                {item.icon}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-[18px] text-white tracking-tight mb-0.5">{item.name}</h4>
                <p className="text-[14px] text-white/50">{item.category}</p>
              </div>
            </div>
            <div className="shrink-0 flex items-center justify-center mr-1">
              <Play className="w-6 h-6 text-white/40 group-hover:text-white transition-colors pl-1" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
