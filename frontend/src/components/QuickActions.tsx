import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Rocket, Brain, Puzzle, Calculator, Zap, ArrowLeft, BookOpen, Lightbulb, GraduationCap, Wrench } from 'lucide-react';

interface QuickActionsProps {
  onPlay?: (gameId: string) => void;
}

export default function QuickActions({ onPlay }: QuickActionsProps) {
  const [isAllOpen, setIsAllOpen] = useState(false);

  const allActions = [
    {
      id: 'focus',
      gameId: 'focus-tap',
      title: 'Boost Focus',
      duration: '2 min',
      icon: <Sparkles className="w-8 h-8 text-[#2dd4bf]" />,
      bg: 'bg-gradient-to-br from-[#064e3b]/80 to-[#022c22]/80 border-[#064e3b] shadow-[0_4px_24px_rgba(6,78,59,0.2)]',
      iconBg: 'bg-[#065f46]/50'
    },
    {
      id: 'relax',
      gameId: 'color-match-focus',
      title: 'Relax Mode',
      duration: '3 min',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#60a5fa]">
           <circle cx="12" cy="7" r="3" />
           <path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8" />
           <path d="M12 14v8" />
           <path d="M9 16c-2 2-2 4-2 4" />
           <path d="M15 16c2 2 2 4 2 4" />
        </svg>
      ),
      bg: 'bg-gradient-to-br from-[#1e3a8a]/80 to-[#172554]/80 border-[#1e3a8a] shadow-[0_4px_24px_rgba(30,58,138,0.2)]',
      iconBg: 'bg-[#1e40af]/50'
    },
    {
      id: 'logic-challenge',
      gameId: 'pattern-logic',
      title: 'Logic Challenge',
      duration: '3 min',
      icon: <Puzzle className="w-8 h-8 text-[#a3e635]" />,
      bg: 'bg-gradient-to-br from-[#3f6212]/80 to-[#14532d]/80 border-[#3f6212] shadow-[0_4px_24px_rgba(63,98,18,0.2)]',
      iconBg: 'bg-[#4d7c0f]/50'
    },
    {
      id: 'speed-reading',
      gameId: 'word-speed-test',
      title: 'Speed Reading',
      duration: '4 min',
      icon: <Zap className="w-8 h-8 text-[#38bdf8]" />,
      bg: 'bg-gradient-to-br from-[#075985]/80 to-[#082f49]/80 border-[#075985] shadow-[0_4px_24px_rgba(7,89,133,0.2)]',
      iconBg: 'bg-[#0369a1]/50'
    }
,
    {
      id: 'understand',
      gameId: 'odd-one-out',
      title: 'Understand',
      duration: '2 min',
      icon: <BookOpen className="w-8 h-8 text-[#f472b6]" />,
      bg: 'bg-gradient-to-br from-[#831843]/80 to-[#500724]/80 border-[#831843] shadow-[0_4px_24px_rgba(131,24,67,0.2)]',
      iconBg: 'bg-[#9d174d]/50'
    },
    {
      id: 'think',
      gameId: 'sequence-logic',
      title: 'Think',
      duration: '3 min',
      icon: <Lightbulb className="w-8 h-8 text-[#a3e635]" />,
      bg: 'bg-gradient-to-br from-[#3f6212]/80 to-[#14532d]/80 border-[#3f6212] shadow-[0_4px_24px_rgba(63,98,18,0.2)]',
      iconBg: 'bg-[#4d7c0f]/50'
    },
    {
      id: 'build',
      gameId: 'sliding-puzzle',
      title: 'Build',
      duration: '4 min',
      icon: <Wrench className="w-8 h-8 text-[#38bdf8]" />,
      bg: 'bg-gradient-to-br from-[#075985]/80 to-[#082f49]/80 border-[#075985] shadow-[0_4px_24px_rgba(7,89,133,0.2)]',
      iconBg: 'bg-[#0369a1]/50'
    }
  ];

  const visibleActions = allActions.slice(0, 2);

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-[22px] font-bold text-white leading-none">Quick Actions</h3>
          <button 
            onClick={() => setIsAllOpen(true)}
            className="text-[#e879f9] text-[15px] font-medium hover:text-[#f0abfc] transition-colors"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {visibleActions.map((action) => (
            <button 
              key={action.id}
              onClick={() => {
                setIsAllOpen(false);
                if (onPlay) onPlay(action.gameId);
              }}
              className={`flex flex-col items-start p-5 rounded-[24px] border border-opacity-30 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] text-left group ${action.bg}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-inner ${action.iconBg}`}>
                {action.icon}
              </div>
              <h4 className="font-bold text-[17px] text-white leading-tight mb-1">{action.title}</h4>
              <p className="text-[14px] text-white/50">{action.duration}</p>
            </button>
          ))}
        </div>
      </div>

      {/* All Quick Actions Modal/Page */}
      <AnimatePresence>
        {isAllOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-[100] bg-[#0a0a10] overflow-y-auto hide-scrollbar"
          >
            <div className="p-6 pb-24 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setIsAllOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-xl font-bold text-white">All Quick Actions</h2>
                <div className="w-10"></div> {/* Spacer for centering */}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {allActions.map((action) => (
                  <button 
                    key={action.id}
                    onClick={() => {
                setIsAllOpen(false);
                if (onPlay) onPlay(action.gameId);
              }}
              className={`flex flex-col items-start p-5 rounded-[24px] border border-opacity-30 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] text-left group ${action.bg}`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-inner ${action.iconBg}`}>
                      {action.icon}
                    </div>
                    <h4 className="font-bold text-[17px] text-white leading-tight mb-1">{action.title}</h4>
                    <p className="text-[14px] text-white/50">{action.duration}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
