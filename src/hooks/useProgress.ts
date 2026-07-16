import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';

export interface Reward {
  id: string;
  title: string;
  amount: number;
  date: string;
}

export interface GameSession {
  id: string;
  gameId?: string;
  gameType: 'memory' | 'speed' | 'focus' | 'logic' | 'math' | 'language' | 'visual' | 'observation' | 'executive' | 'creativity';
  score: number;
  accuracy?: number;
  difficulty: string;
  timestamp: number;
  reactionTime?: number; // Average reaction time in ms
  maxLevel?: number; // Highest level reached in memory game
}

export interface UserStats {
  dailyStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  totalGamesPlayed: number;
  novaCoins: number;
  totalXp: number;
  highScores: {
    memory: number;
    speed: number;
    focus: number;
    logic: number;
    math: number;
    language: number;
    visual: number;
    executive: number;
    creativity: number;
    observation: number;
  };
  weeklyPerformance: { date: string; score: number }[];
  streakHistory: string[];
  rewardsHistory: Reward[];
}

const DEFAULT_STATS: UserStats = {
  dailyStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  totalGamesPlayed: 0,
  novaCoins: 0,
  totalXp: 0,
  highScores: { memory: 0, speed: 0, focus: 0, logic: 0, math: 0, language: 0, visual: 0, observation: 0, executive: 0, creativity: 0 },
  weeklyPerformance: [],
  streakHistory: [],
  rewardsHistory: [],
};

export function useProgress() {

  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Check auth
  useEffect(() => {
    if (!supabase) return;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      if (supabase && userId) {
        // Load from supabase
        try {
          const { data: statsData } = await supabase.from('user_stats').select('stats').eq('user_id', userId).single();
          if (statsData && statsData.stats) {
            setStats(statsData.stats);
          }
          
          const { data: sessionsData } = await supabase.from('game_sessions').select('*').eq('user_id', userId).order('timestamp', { ascending: true });
          if (sessionsData && sessionsData.length > 0) {
            setSessions(sessionsData.map(s => ({
              ...s,
              id: s.id.toString(),
            })));
          }
        } catch (e) {
          console.error('Error loading from supabase', e);
        }
      } else {
        // Fallback to local storage
        const savedStats = localStorage.getItem('brainova_stats_v2');
        if (savedStats && savedStats.includes('"memory":1250')) {
          localStorage.removeItem('brainova_stats_v2');
          localStorage.removeItem('brainova_sessions_v2');
          return;
        }

        const savedSessions = localStorage.getItem('brainova_sessions_v2');
        
        if (savedStats) {
          try { setStats(JSON.parse(savedStats)); } catch (e) {}
        }
        if (savedSessions) {
          try { setSessions(JSON.parse(savedSessions)); } catch (e) {}
        }
      }
    };
    
    loadData();
  }, [userId]);

  // Save data whenever it changes
  useEffect(() => {
    if (userId && supabase) {
      supabase.from('user_stats').upsert({ user_id: userId, stats }).then();
    } else {
      localStorage.setItem('brainova_stats_v2', JSON.stringify(stats));
    }
  }, [stats, userId]);

  useEffect(() => {
    if (!userId) {
      localStorage.setItem('brainova_sessions_v2', JSON.stringify(sessions));
    }
  }, [sessions, userId]);

  const recordGame = async (session: Omit<GameSession, 'id' | 'timestamp'>) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const newSession: GameSession = {
      ...session,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: now.getTime(),
    };

    setSessions(prev => [...prev, newSession]);
    
    if (userId && supabase) {
      try {
        await supabase.from('game_sessions').insert({
          user_id: userId,
          game_type: session.gameType,
          score: session.score,
          difficulty: session.difficulty,
          timestamp: newSession.timestamp,
          reaction_time: session.reactionTime || null,
          max_level: session.maxLevel || null,
          accuracy: session.accuracy || null
        });
      } catch (e) {
        console.error("Failed to save session to supabase", e);
      }
    }

    setStats(prev => {
      const newStats = { ...prev };
      
      // Update total games
      newStats.totalGamesPlayed += 1;
      newStats.totalXp = (newStats.totalXp || 0) + session.score;
            const earnedCoins = Math.max(10, Math.floor(session.score / 5));
      newStats.novaCoins = (newStats.novaCoins || 0) + earnedCoins;
      
      if (!newStats.rewardsHistory) newStats.rewardsHistory = [];
      newStats.rewardsHistory.unshift({
        id: Math.random().toString(36).substring(2, 9),
        title: session.gameType.charAt(0).toUpperCase() + session.gameType.slice(1) + ' Game',
        amount: earnedCoins,
        date: now.toISOString()
      });
      // Keep only last 50 rewards
      if (newStats.rewardsHistory.length > 50) {
        newStats.rewardsHistory = newStats.rewardsHistory.slice(0, 50);
      }

      // Update high scores
      if (session.score > newStats.highScores[session.gameType]) {
        newStats.highScores[session.gameType] = session.score;
      }

      // Update streak
      if (prev.lastPlayedDate !== todayStr) {
        if (!prev.lastPlayedDate) {
          // First time playing
          newStats.dailyStreak = 1;
        } else {
          const lastDate = new Date(prev.lastPlayedDate);
          const diffTime = Math.abs(now.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays === 1) {
            // Played yesterday, increment streak
            newStats.dailyStreak += 1;
            
            // Give streak bonus
            const streakBonus = Math.min(50, newStats.dailyStreak * 5);
            newStats.novaCoins += streakBonus;
            newStats.rewardsHistory.unshift({
              id: Math.random().toString(36).substring(2, 9),
              title: `Daily Streak (${newStats.dailyStreak} days)`,
              amount: streakBonus,
              date: now.toISOString()
            });
          } else if (diffDays > 1) {
            // Missed a day, reset streak
            newStats.dailyStreak = 1;
          }
        }
        newStats.lastPlayedDate = todayStr;
      }
      
      if (!newStats.streakHistory) {
         newStats.streakHistory = [];
      }
      if (!newStats.streakHistory.includes(todayStr)) {
          newStats.streakHistory.push(todayStr);
      }
      if (newStats.dailyStreak > (newStats.longestStreak || 0)) {
          newStats.longestStreak = newStats.dailyStreak;
      }

      // Update weekly performance
      const existingDayIndex = newStats.weeklyPerformance.findIndex(p => p.date === todayStr);
      if (existingDayIndex >= 0) {
        // Add to today's total score
        newStats.weeklyPerformance[existingDayIndex].score += session.score;
      } else {
        // Add new day
        newStats.weeklyPerformance.push({ date: todayStr, score: session.score });
        // Keep only last 7 days
        if (newStats.weeklyPerformance.length > 7) {
          newStats.weeklyPerformance.shift();
        }
      }

      return newStats;
    });
  };

  return {
    stats,
    sessions,
    recordGame
  };
}
