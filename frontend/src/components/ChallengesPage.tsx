import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, Target, Clock, Gamepad2, Brain, Sparkles, Check, AlertCircle } from 'lucide-react';

interface ChallengesPageProps {
  onBack: () => void;
  onPlay: (gameId: string) => void;
  sessions?: any[];
}

export function ChallengesPage({ onBack, onPlay, sessions = [] }: ChallengesPageProps) {
  // Compute stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  const todaySessions = sessions.filter(s => s.timestamp >= todayTimestamp);
  
  // Calculate focus time: sum of focus games. Assuming ~2 min per game played today.
  const focusScores = todaySessions.filter(s => s.gameType === 'focus').map(s => s.score);
  const focusGamesCount = focusScores.length;
  const focusTimeMinutes = focusGamesCount * 2;
  const maxFocusScore = focusScores.length > 0 ? Math.max(...focusScores) : 0;

  const focusTimeProgress = Math.min(100, (focusTimeMinutes / 60) * 100);
  const gamesProgress = Math.min(100, (focusGamesCount / 3) * 100);
  const focusScoreProgress = Math.min(100, (maxFocusScore / 80) * 100);

  return (
    <div className="min-h-screen bg-[#0b0b10] text-white overflow-y-auto pb-24">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-8 relative">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors absolute left-0"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-[18px] font-bold text-center w-full">7-Day Focus Plan</h1>
        </div>

        {/* Progress Card */}
        <div className="bg-[#12161b] rounded-3xl p-6 border border-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.05)] mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full border-2 border-emerald-500/30 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full" />
              <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center relative z-10">
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
            </div>
            <div>
              <h2 className="text-[#34d399] text-[18px] font-bold mb-1">Day 1 of 7</h2>
              <p className="text-[#9ca3af] text-[14px]">You're off to a great start!</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#1f2937] -translate-y-1/2" />
            <div className="absolute top-1/2 left-4 w-[5%] h-0.5 bg-emerald-500 -translate-y-1/2" />
            
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  day === 1 ? 'bg-emerald-500 border-emerald-500' :
                  'bg-[#1f2937] border-[#374151]'
                }`}>
                  {day === 1 && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className={`text-[13px] font-medium ${
                  day === 1 ? 'text-emerald-500' : 'text-[#6b7280]'
                }`}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Goal */}
        <div className="bg-[#12141a] rounded-3xl p-6 border border-white/5 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-purple-400" />
            <h2 className="text-[17px] font-bold text-white tracking-wide">Today's Goal</h2>
          </div>

          <div className="space-y-6">
            {/* Focus Time */}
            <div 
              className="cursor-pointer group" 
              onClick={() => onPlay('focus-tap')}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-[#9ca3af] font-medium mb-1 group-hover:text-white transition-colors">Focus Time</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-bold text-white">{focusTimeMinutes}</span>
                    <span className="text-[14px] text-[#9ca3af]">/ 60 min</span>
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-full border-2 ${focusTimeMinutes >= 60 ? 'border-emerald-500 bg-emerald-500' : 'border-[#1f2937]'} flex items-center justify-center`}>
                  {focusTimeMinutes >= 60 && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
              <div className="h-2.5 bg-[#1f2937] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${focusTimeProgress}%` }} />
              </div>
            </div>

            {/* Games */}
            <div 
              className="cursor-pointer group"
              onClick={() => onPlay('memory-grid')}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Gamepad2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-[#9ca3af] font-medium mb-1 group-hover:text-white transition-colors">Focus Games</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-bold text-white">{focusGamesCount}</span>
                    <span className="text-[14px] text-[#9ca3af]">/ 3</span>
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-full border-2 ${focusGamesCount >= 3 ? 'border-emerald-500 bg-emerald-500' : 'border-[#1f2937]'} flex items-center justify-center`}>
                  {focusGamesCount >= 3 && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
              <div className="h-2.5 bg-[#1f2937] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${gamesProgress}%` }} />
              </div>
            </div>

            {/* Focus Score */}
            <div 
              className="cursor-pointer group"
              onClick={() => onPlay('color-match-focus')}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-[#9ca3af] font-medium mb-1 group-hover:text-white transition-colors">Focus Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-bold text-blue-400">{maxFocusScore}</span>
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-full border-2 ${maxFocusScore >= 80 ? 'border-blue-500 bg-blue-500' : 'border-transparent'} flex items-center justify-center`}>
                  {maxFocusScore >= 80 ? <Check className="w-4 h-4 text-white" /> : <AlertCircle className="w-6 h-6 text-blue-500" />}
                </div>
              </div>
              <div className="h-2.5 bg-[#1f2937] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${focusScoreProgress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recommended for You */}
        <div className="bg-[#12141a] rounded-3xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400 fill-purple-400/20" />
            <h2 className="text-[17px] font-bold text-white tracking-wide">Recommended for You</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-[#1a1c23] rounded-2xl p-5 border border-white/5 flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#2d1b4e] flex items-center justify-center shrink-0 border border-purple-500/20">
                <div className="grid grid-cols-3 gap-0.5 w-8 h-8 opacity-80">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`bg-purple-300 rounded-[1px] ${[1,3,4,7].includes(i) ? 'opacity-100' : 'opacity-20'}`} />
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-[16px] font-bold text-white mb-1">Memory Grid</h3>
                <p className="text-[13px] text-[#9ca3af] leading-relaxed mb-3">Improve short term memory</p>
                <button 
                  onClick={() => onPlay('memory-grid')}
                  className="w-full py-2 bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  Play
                </button>
              </div>
            </div>

            <div className="bg-[#1a1c23] rounded-2xl p-5 border border-white/5 flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Target className="w-8 h-8 text-emerald-400 opacity-80" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-[16px] font-bold text-white mb-1">Focus Tap</h3>
                <p className="text-[13px] text-[#9ca3af] leading-relaxed mb-3">Enhance target precision</p>
                <button 
                  onClick={() => onPlay('focus-tap')}
                  className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold rounded-xl transition-colors text-sm"
                >
                  Play
                </button>
              </div>
            </div>

            <div className="bg-[#1a1c23] rounded-2xl p-5 border border-white/5 flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Brain className="w-8 h-8 text-blue-400 opacity-80" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-[16px] font-bold text-white mb-1">Color Match</h3>
                <p className="text-[13px] text-[#9ca3af] leading-relaxed mb-3">Train conflict processing</p>
                <button 
                  onClick={() => onPlay('color-match-focus')}
                  className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold rounded-xl transition-colors text-sm"
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
