import React, { useState } from 'react';
import { ChevronLeft, Flame, Award, Target, Lock, Zap, Sun, Shield, Lightbulb, CheckCircle, Heart, Layers, Crown, Timer, Book, Brain, Wind, Moon, TrendingUp, Calculator, Diamond, Gem, Trophy, Activity, Cpu, Check, Lock as LockIcon, Sparkles, Flag, Rocket, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { UserStats } from '../hooks/useProgress';

interface AchievementsPageProps {
  stats: UserStats;
  onBack: () => void;
}

export default function AchievementsPage({ onBack, stats }: AchievementsPageProps) {
  const [filter, setFilter] = useState<'all' | 'locked' | 'unlocked'>('all');

  const allAchievements = [
    {
      id: 'first_step',
      title: 'First Step',
      subtitle: 'Complete your first game',
      xp: 10,
      icon: <Flag className="w-7 h-7 text-[#10b981]" strokeWidth={2} />,
      color: 'bg-[#10b981]',
      date: stats.totalGamesPlayed > 0 ? 'Unlocked' : 'Locked',
      unlocked: stats.totalGamesPlayed > 0,
      hexagonBorder: 'border-[#10b981]'
    },
    {
      id: 'streak_7',
      title: '7 Day Streak',
      subtitle: 'Play for 7 days in a row',
      xp: 20,
      icon: <Shield className="w-7 h-7 text-[#10b981]" strokeWidth={2} />,
      color: 'bg-[#10b981]',
      date: stats.longestStreak >= 7 ? 'Unlocked' : 'Locked',
      unlocked: stats.longestStreak >= 7,
      hexagonBorder: 'border-[#10b981]'
    },
    {
      id: 'focus_master',
      title: 'Focus Master',
      subtitle: 'Focus score above 80',
      xp: 30,
      icon: <Clock className="w-7 h-7 text-[#fbbf24]" strokeWidth={2} />,
      color: 'bg-[#fbbf24]',
      date: stats.highScores.focus >= 80 ? 'Unlocked' : 'Locked',
      unlocked: stats.highScores.focus >= 80,
      hexagonBorder: 'border-[#fbbf24]'
    },
    {
      id: 'brain_analyzer',
      title: 'Brain Analyzer',
      subtitle: 'Complete your first AI analysis',
      xp: 25,
      icon: <Brain className="w-7 h-7 text-[#3b82f6]" strokeWidth={2} />,
      color: 'bg-[#3b82f6]',
      date: stats.totalGamesPlayed > 5 ? 'Unlocked' : 'Locked', // proxy
      unlocked: stats.totalGamesPlayed > 5,
      hexagonBorder: 'border-[#3b82f6]'
    },
    {
      id: 'quick_thinker',
      title: 'Quick Thinker',
      subtitle: '1000 Total Score',
      xp: 50,
      icon: <Zap className="w-7 h-7 text-[#a855f7]" strokeWidth={2} />,
      color: 'bg-[#a855f7]',
      date: stats.totalXp >= 1000 ? 'Unlocked' : 'Locked',
      unlocked: stats.totalXp >= 1000,
      hexagonBorder: 'border-[#a855f7]'
    },
    {
      id: 'early_riser',
      title: 'Early Riser',
      subtitle: 'Play before 8 AM',
      xp: 40,
      icon: <Sun className="w-7 h-7 text-[#eab308]" strokeWidth={2} />,
      color: 'bg-[#eab308]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#eab308]'
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      subtitle: 'Play 7 days a week',
      xp: 60,
      icon: <Award className="w-7 h-7 text-[#ef4444]" strokeWidth={2} />,
      color: 'bg-[#ef4444]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#ef4444]'
    },
    {
      id: 'logic_legend',
      title: 'Logic Legend',
      subtitle: 'Score 2000 in logic',
      xp: 100,
      icon: <Lightbulb className="w-7 h-7 text-[#f97316]" strokeWidth={2} />,
      color: 'bg-[#f97316]',
      date: stats.highScores.logic >= 2000 ? 'Unlocked' : 'Locked',
      unlocked: stats.highScores.logic >= 2000,
      hexagonBorder: 'border-[#f97316]'
    },
    {
      id: 'perfect_week',
      title: 'Perfect Week',
      subtitle: '100% Accuracy',
      xp: 150,
      icon: <CheckCircle className="w-7 h-7 text-[#14b8a6]" strokeWidth={2} />,
      color: 'bg-[#14b8a6]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#14b8a6]'
    },
    {
      id: 'dedicated_mind',
      title: 'Dedicated Mind',
      subtitle: '14 Day Streak',
      xp: 200,
      icon: <Heart className="w-7 h-7 text-[#ec4899]" strokeWidth={2} />,
      color: 'bg-[#ec4899]',
      date: stats.longestStreak >= 14 ? 'Unlocked' : 'Locked',
      unlocked: stats.longestStreak >= 14,
      hexagonBorder: 'border-[#ec4899]'
    },
    {
      id: 'habit_builder',
      title: 'Habit Builder',
      subtitle: '30 Day Streak',
      xp: 300,
      icon: <Layers className="w-7 h-7 text-[#8b5cf6]" strokeWidth={2} />,
      color: 'bg-[#8b5cf6]',
      date: stats.longestStreak >= 30 ? 'Unlocked' : 'Locked',
      unlocked: stats.longestStreak >= 30,
      hexagonBorder: 'border-[#8b5cf6]'
    },
    {
      id: 'century_mark',
      title: 'Century Mark',
      subtitle: '100 Games Played',
      xp: 250,
      icon: <Crown className="w-7 h-7 text-[#eab308]" strokeWidth={2} />,
      color: 'bg-[#eab308]',
      date: stats.totalGamesPlayed >= 100 ? 'Unlocked' : 'Locked',
      unlocked: stats.totalGamesPlayed >= 100,
      hexagonBorder: 'border-[#eab308]'
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      subtitle: 'React <200ms',
      xp: 150,
      icon: <Timer className="w-7 h-7 text-[#f43f5e]" strokeWidth={2} />,
      color: 'bg-[#f43f5e]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#f43f5e]'
    },
    {
      id: 'word_smith',
      title: 'Word Smith',
      subtitle: 'Find 50 Words',
      xp: 120,
      icon: <Book className="w-7 h-7 text-[#6366f1]" strokeWidth={2} />,
      color: 'bg-[#6366f1]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#6366f1]'
    },
    {
      id: 'memory_elephant',
      title: 'Memory Elephant',
      subtitle: 'Level 10 Reached',
      xp: 250,
      icon: <Brain className="w-7 h-7 text-[#94a3b8]" strokeWidth={2} />,
      color: 'bg-[#94a3b8]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#94a3b8]'
    },
    {
      id: 'zen_master',
      title: 'Zen Master',
      subtitle: 'Play 50 Focus Games',
      xp: 200,
      icon: <Wind className="w-7 h-7 text-[#14b8a6]" strokeWidth={2} />,
      color: 'bg-[#14b8a6]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#14b8a6]'
    },
    {
      id: 'night_owl',
      title: 'Night Owl',
      subtitle: 'Play after 10 PM',
      xp: 100,
      icon: <Moon className="w-7 h-7 text-[#6366f1]" strokeWidth={2} />,
      color: 'bg-[#6366f1]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#6366f1]'
    },
    {
      id: 'unstoppable',
      title: 'Unstoppable Force',
      subtitle: '5x Combo',
      xp: 150,
      icon: <TrendingUp className="w-7 h-7 text-[#f97316]" strokeWidth={2} />,
      color: 'bg-[#f97316]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#f97316]'
    },
    {
      id: 'math_whiz',
      title: 'Math Whiz',
      subtitle: 'Solve 50 Equations',
      xp: 120,
      icon: <Calculator className="w-7 h-7 text-[#0ea5e9]" strokeWidth={2} />,
      color: 'bg-[#0ea5e9]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#0ea5e9]'
    },
    {
      id: 'flawless_run',
      title: 'Flawless Run',
      subtitle: 'No Mistakes Session',
      xp: 200,
      icon: <Diamond className="w-7 h-7 text-[#06b6d4]" strokeWidth={2} />,
      color: 'bg-[#06b6d4]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#06b6d4]'
    },
    {
      id: 'elite_mind',
      title: 'Elite Mind',
      subtitle: '10,000 XP Reached',
      xp: 500,
      icon: <Gem className="w-7 h-7 text-[#d946ef]" strokeWidth={2} />,
      color: 'bg-[#d946ef]',
      date: stats.totalXp >= 10000 ? 'Unlocked' : 'Locked',
      unlocked: stats.totalXp >= 10000,
      hexagonBorder: 'border-[#d946ef]'
    },
    {
      id: 'top_percent',
      title: 'Top 1% Player',
      subtitle: 'Leaderboard Elite',
      xp: 1000,
      icon: <Trophy className="w-7 h-7 text-[#fbbf24]" strokeWidth={2} />,
      color: 'bg-[#fbbf24]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#fbbf24]'
    },
    {
      id: 'consistent',
      title: 'Steady Growth',
      subtitle: 'Play 5 Days Row',
      xp: 100,
      icon: <Activity className="w-7 h-7 text-[#22c55e]" strokeWidth={2} />,
      color: 'bg-[#22c55e]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#22c55e]'
    },
    {
      id: 'cognitive_master',
      title: 'Cognitive Master',
      subtitle: 'Max Level All Categories',
      xp: 2000,
      icon: <Cpu className="w-7 h-7 text-[#c026d3]" strokeWidth={2} />,
      color: 'bg-[#c026d3]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#c026d3]'
    },
    {
      id: 'puzzle_solver',
      title: 'Puzzle Solver',
      subtitle: 'Solve 50 puzzles',
      xp: 120,
      icon: <Sparkles className="w-7 h-7 text-[#f43f5e]" strokeWidth={2} />,
      color: 'bg-[#f43f5e]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#f43f5e]'
    },
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      subtitle: 'Share 10 times',
      xp: 50,
      icon: <Activity className="w-7 h-7 text-[#0ea5e9]" strokeWidth={2} />,
      color: 'bg-[#0ea5e9]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#0ea5e9]'
    },
    {
      id: 'sharp_eyes',
      title: 'Sharp Eyes',
      subtitle: 'Observation > 80',
      xp: 150,
      icon: <Target className="w-7 h-7 text-[#a855f7]" strokeWidth={2} />,
      color: 'bg-[#a855f7]',
      date: stats.highScores.observation >= 80 ? 'Unlocked' : 'Locked',
      unlocked: stats.highScores.observation >= 80,
      hexagonBorder: 'border-[#a855f7]'
    },
    {
      id: 'creative_spark',
      title: 'Creative Spark',
      subtitle: 'Creativity > 80',
      xp: 150,
      icon: <Sparkles className="w-7 h-7 text-[#ec4899]" strokeWidth={2} />,
      color: 'bg-[#ec4899]',
      date: stats.highScores.creativity >= 80 ? 'Unlocked' : 'Locked',
      unlocked: stats.highScores.creativity >= 80,
      hexagonBorder: 'border-[#ec4899]'
    },
    {
      id: 'multi_tasker',
      title: 'Multi-Tasker',
      subtitle: '3 games in 10 mins',
      xp: 100,
      icon: <Layers className="w-7 h-7 text-[#14b8a6]" strokeWidth={2} />,
      color: 'bg-[#14b8a6]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#14b8a6]'
    },
    {
      id: 'weekend_warrior',
      title: 'Weekend Warrior',
      subtitle: 'Play on Sat & Sun',
      xp: 50,
      icon: <Clock className="w-7 h-7 text-[#f59e0b]" strokeWidth={2} />,
      color: 'bg-[#f59e0b]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#f59e0b]'
    },
    {
      id: 'half_century',
      title: 'Half Century',
      subtitle: '50 Games Played',
      xp: 100,
      icon: <Flag className="w-7 h-7 text-[#eab308]" strokeWidth={2} />,
      color: 'bg-[#eab308]',
      date: stats.totalGamesPlayed >= 50 ? 'Unlocked' : 'Locked',
      unlocked: stats.totalGamesPlayed >= 50,
      hexagonBorder: 'border-[#eab308]'
    },
    {
      id: 'loyal_member',
      title: 'Loyal Member',
      subtitle: '100 Days active',
      xp: 500,
      icon: <Heart className="w-7 h-7 text-[#f43f5e]" strokeWidth={2} />,
      color: 'bg-[#f43f5e]',
      date: stats.streakHistory.length >= 100 ? 'Unlocked' : 'Locked',
      unlocked: stats.streakHistory.length >= 100,
      hexagonBorder: 'border-[#f43f5e]'
    },
    {
      id: 'super_focus',
      title: 'Super Focus',
      subtitle: 'No mistakes for 5m',
      xp: 200,
      icon: <Target className="w-7 h-7 text-[#10b981]" strokeWidth={2} />,
      color: 'bg-[#10b981]',
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#10b981]'
    },
    {
      id: 'grand_master',
      title: 'Grand Master',
      subtitle: 'Reach 50,000 XP',
      xp: 1000,
      icon: <Crown className="w-7 h-7 text-[#fbbf24]" strokeWidth={2} />,
      color: 'bg-[#fbbf24]',
      date: stats.totalXp >= 50000 ? 'Unlocked' : 'Locked',
      unlocked: stats.totalXp >= 50000,
      hexagonBorder: 'border-[#fbbf24]'
    }
  ];

  const filteredAchievements = allAchievements.filter(ach => {
    if (filter === 'all') return true;
    if (filter === 'locked') return !ach.unlocked;
    if (filter === 'unlocked') return ach.unlocked;
    return true;
  });

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0b0b12] font-sans text-white relative z-50">
      <div className="flex items-center px-6 py-5 shrink-0 bg-[#0b0b12] z-10 sticky top-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-bold text-[18px]">Achievements</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {/* Top Trophy Card */}
        <div className="bg-[#121124] rounded-[24px] p-6 border border-[#2a1b4a] shadow-[0_10px_40px_rgba(0,0,0,0.3)] mb-8 flex items-center gap-6 relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/20 blur-[50px] rounded-full" />
          
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
             {/* Circular Rings Behind Trophy */}
             <div className="absolute inset-2 rounded-full border border-purple-500/30"></div>
             <div className="absolute inset-5 rounded-full border border-purple-400/20"></div>
             
             {/* Actual Trophy Icon Representation */}
             <div className="relative z-10 w-16 h-16 bg-gradient-to-b from-blue-400 to-purple-600 rounded-[16px] flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-300/30">
               <Trophy className="w-8 h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
               <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-60"></div>
             </div>

             {/* Little sparkles around */}
             <Sparkles className="absolute top-2 left-2 w-3 h-3 text-purple-300 opacity-60" />
             <Sparkles className="absolute bottom-4 right-2 w-4 h-4 text-blue-300 opacity-60" />
          </div>

          <div className="flex-1 relative z-10">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[40px] font-bold text-white tracking-tight leading-none">{unlockedCount}</span>
              <span className="text-[20px] text-white/50 font-medium">/ {allAchievements.length}</span>
            </div>
            <p className="text-[14px] text-white/70 mb-4 font-medium">Achievements Unlocked</p>
            
            <div className="h-2 bg-[#1a153a] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full"
                style={{ width: `${(unlockedCount / allAchievements.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-full font-semibold text-[14px] whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#3b1578] text-white border border-purple-500/50 shadow-[0_0_15px_rgba(147,51,255,0.3)]' : 'bg-[#121124] text-white/60 border border-white/5 hover:text-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('locked')}
            className={`px-6 py-2.5 rounded-full font-semibold text-[14px] whitespace-nowrap flex items-center gap-2 transition-colors ${filter === 'locked' ? 'bg-[#3b1578] text-white border border-purple-500/50 shadow-[0_0_15px_rgba(147,51,255,0.3)]' : 'bg-[#121124] text-white/60 border border-white/5 hover:text-white'}`}
          >
            <LockIcon className="w-4 h-4" /> Locked
          </button>
          <button 
            onClick={() => setFilter('unlocked')}
            className={`px-6 py-2.5 rounded-full font-semibold text-[14px] whitespace-nowrap flex items-center gap-2 transition-colors ${filter === 'unlocked' ? 'bg-[#3b1578] text-white border border-purple-500/50 shadow-[0_0_15px_rgba(147,51,255,0.3)]' : 'bg-[#121124] text-white/60 border border-white/5 hover:text-white'}`}
          >
            <LockIcon className="w-4 h-4" /> Unlocked
          </button>
        </div>

        {/* List Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
          <h3 className="font-semibold text-[16px] text-white capitalize">{filter}</h3>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredAchievements.map((ach) => (
            <div key={ach.id} className="bg-[#121124] border border-[#2a1b4a] rounded-[24px] p-5 flex items-center gap-5 hover:bg-[#16142b] transition-colors relative overflow-hidden group">
              <div className={`relative w-16 h-16 shrink-0 flex items-center justify-center`}>
                 {/* Hexagon shape using CSS polygon */}
                 <div className={`absolute inset-0 bg-[#0f0e1c] border-2 ${ach.hexagonBorder} opacity-50`} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', borderRadius: '4px' }}></div>
                 <div className="relative z-10">
                   {ach.icon}
                 </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[16px] text-white mb-1 tracking-wide">{ach.title}</h4>
                <p className="text-[13px] text-[#9ca3af] mb-2">{ach.subtitle}</p>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-[13px] font-bold text-yellow-400">{ach.xp} XP</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                {ach.unlocked ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <LockIcon className="w-4 h-4 text-white/30" />
                  </div>
                )}
                <span className="text-[12px] font-medium text-white/40">{ach.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
