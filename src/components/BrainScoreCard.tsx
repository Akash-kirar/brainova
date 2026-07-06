import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface BrainScoreCardProps {
  stats?: any;
  onClick?: () => void;
}

export default function BrainScoreCard({ onClick, stats }: BrainScoreCardProps) {
  
  // Calculate average of high scores
  const score = stats && stats.highScores 
    ? Math.round((
        (stats.highScores.memory || 0) + 
        (stats.highScores.focus || 0) + 
        (stats.highScores.logic || 0) + 
        (stats.highScores.math || 0) + 
        (stats.highScores.speed || 0) + 
        (stats.highScores.language || 0)
      ) / 6)
    : 0;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`relative w-full rounded-[24px] overflow-hidden p-6 shadow-xl border border-white/5 ${onClick ? 'cursor-pointer hover:shadow-2xl transition-all' : ''}`}
      style={{
        background: 'linear-gradient(135deg, #2A1154 0%, #0F0822 100%)'
      }}
    >
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          {/* Progress Circle */}
          <div className="relative flex items-center justify-center">
            <svg width="110" height="110" className="transform -rotate-90">
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              {/* Background circle */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                className="stroke-indigo-900/40"
                strokeWidth="12"
                fill="none"
              />
              {/* Foreground circle */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="url(#score-gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{score}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-[22px] font-bold text-white mb-2 leading-none">Brain Score</h3>
            <p className="text-[#B9A3D6] text-[15px] font-medium mb-1">Good job!</p>
            <p className="text-[#4ADE80] text-[15px] font-semibold">+8% from yesterday</p>
          </div>
        </div>

        <div className="self-start mt-2">
          <ChevronRight className="w-5 h-5 text-white/50" />
        </div>
      </div>

      {/* Background Decorative Graph */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none opacity-80">
        <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path
            d="M -10,80 C 40,75 80,95 120,95 C 160,95 180,60 220,70 C 260,80 280,30 320,40 C 350,47 380,20 410,10"
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Scatter dots */}
          <circle cx="20" cy="81" r="3" fill="#8B5CF6" />
          <circle cx="80" cy="90" r="3" fill="#8B5CF6" />
          <circle cx="150" cy="84" r="3" fill="#8B5CF6" />
          <circle cx="230" cy="74" r="4" fill="#3B82F6" />
          <circle cx="310" cy="38" r="4" fill="#3B82F6" />
          <circle cx="370" cy="22" r="5" fill="#3B82F6" />
        </svg>
      </div>
    </motion.div>
  );
}
