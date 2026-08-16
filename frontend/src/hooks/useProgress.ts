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
  reactionTime?: number;
  maxLevel?: number;
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

const normalizeStats = (stats: Partial<UserStats> | null | undefined): UserStats => ({
  ...DEFAULT_STATS,
  ...stats,
  highScores: {
    ...DEFAULT_STATS.highScores,
    ...(stats?.highScores || {}),
  },
  weeklyPerformance: stats?.weeklyPerformance || [],
  streakHistory: stats?.streakHistory || [],
  rewardsHistory: stats?.rewardsHistory || [],
});

const normalizeSession = (session: any): GameSession => ({
  id: String(session.id),
  gameId: session.game_id || session.gameId || undefined,
  gameType: session.game_type || session.gameType,
  score: Number(session.score || 0),
  accuracy: session.accuracy ?? undefined,
  difficulty: session.difficulty || 'easy',
  timestamp: Number(session.timestamp || new Date(session.created_at).getTime()),
  reactionTime: session.reaction_time ?? session.reactionTime ?? undefined,
  maxLevel: session.max_level ?? session.maxLevel ?? undefined,
});

export function useProgress() {

  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadedRemoteUserId, setLoadedRemoteUserId] = useState<string | null>(null);

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

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      if (supabase && userId) {
        setLoadedRemoteUserId(null);
        try {
          const { data: statsData, error: statsError } = await supabase
            .from('user_stats')
            .select('stats')
            .eq('user_id', userId)
            .maybeSingle();

          if (statsError) throw statsError;

          const { data: sessionsData, error: sessionsError } = await supabase
            .from('game_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: true });

          if (sessionsError) throw sessionsError;

          if (!ignore) {
            setStats(normalizeStats(statsData?.stats));
            setSessions((sessionsData || []).map(normalizeSession));
            setLoadedRemoteUserId(userId);
          }
        } catch (e) {
          console.error('Error loading from supabase', e);
          if (!ignore) setLoadedRemoteUserId(userId);
        }
        return;
      }

      setLoadedRemoteUserId(null);
      const savedStats = localStorage.getItem('brainova_stats_v2');
      if (savedStats && savedStats.includes('"memory":1250')) {
        localStorage.removeItem('brainova_stats_v2');
        localStorage.removeItem('brainova_sessions_v2');
        return;
      }

      const savedSessions = localStorage.getItem('brainova_sessions_v2');

      if (savedStats) {
        try { setStats(normalizeStats(JSON.parse(savedStats))); } catch (e) {}
      } else {
        setStats(DEFAULT_STATS);
      }

      if (savedSessions) {
        try { setSessions(JSON.parse(savedSessions)); } catch (e) {}
      } else {
        setSessions([]);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [userId]);

  useEffect(() => {
    if (userId && supabase) {
      if (loadedRemoteUserId !== userId) return;
      supabase.from('user_stats').upsert({ user_id: userId, stats }).then(({ error }) => {
        if (error) console.error('Failed to save stats to supabase', error);
      });
    } else {
      localStorage.setItem('brainova_stats_v2', JSON.stringify(stats));
    }
  }, [stats, userId, loadedRemoteUserId]);

  useEffect(() => {
    if (!userId) {
      localStorage.setItem('brainova_sessions_v2', JSON.stringify(sessions));
    }
  }, [sessions, userId]);

  const getLocalDateStr = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  };

  const calculateStreaksFromHistory = (history: string[], todayStr: string) => {
    if (!history || history.length === 0) return { current: 0, longest: 0 };
    const sorted = [...new Set(history)].sort();
    let longest = 1;
    let currentStreakCount = 1;
    for (let i = 1; i < sorted.length; i++) {
      const [y1, m1, d1] = sorted[i-1].split('-').map(Number);
      const [y2, m2, d2] = sorted[i].split('-').map(Number);
      const diffDays = Math.round((new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime()) / 86400000);
      if (diffDays === 1) {
        currentStreakCount++;
        if (currentStreakCount > longest) longest = currentStreakCount;
      } else if (diffDays > 1) {
        currentStreakCount = 1;
      }
    }
    const lastPlayed = sorted[sorted.length - 1];
    let current = 0;
    if (lastPlayed) {
      const [y1, m1, d1] = lastPlayed.split('-').map(Number);
      const [y2, m2, d2] = todayStr.split('-').map(Number);
      const diffToToday = Math.round((new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime()) / 86400000);
      if (diffToToday <= 1) {
        current = currentStreakCount;
      }
    }
    return { current, longest: Math.max(longest, currentStreakCount) };
  };

  // Auto-correct streaks if user opens app on a new day
  useEffect(() => {
    if (!stats || !stats.streakHistory) return;
    const todayStr = getLocalDateStr();
    const { current, longest } = calculateStreaksFromHistory(stats.streakHistory, todayStr);
    
    if (stats.dailyStreak !== current || (stats.longestStreak || 0) < longest) {
      setStats(prev => ({
        ...prev,
        dailyStreak: current,
        longestStreak: Math.max(prev.longestStreak || 0, longest)
      }));
    }
  }, [stats.streakHistory, stats.dailyStreak, stats.longestStreak]);

  const recordGame = async (session: Omit<GameSession, 'id' | 'timestamp'>) => {
    const now = new Date();
    const todayStr = getLocalDateStr();

    const newSession: GameSession = {
      ...session,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: now.getTime(),
    };

    setSessions(prev => [...prev, newSession]);

    if (userId && supabase) {
      try {
        const { error } = await supabase.from('game_sessions').insert({
          user_id: userId,
          game_id: session.gameId || null,
          game_type: session.gameType,
          score: session.score,
          difficulty: session.difficulty,
          timestamp: newSession.timestamp,
          reaction_time: session.reactionTime || null,
          max_level: session.maxLevel || null,
          accuracy: session.accuracy || null,
        });

        if (error) throw error;
      } catch (e) {
        console.error('Failed to save session to supabase', e);
      }
    }

    setStats(prev => {
      const newStats = normalizeStats(prev);

      newStats.totalGamesPlayed += 1;
      newStats.totalXp = (newStats.totalXp || 0) + session.score;
      const earnedCoins = Math.max(10, Math.floor(session.score / 5));
      newStats.novaCoins = (newStats.novaCoins || 0) + earnedCoins;

      newStats.rewardsHistory.unshift({
        id: Math.random().toString(36).substring(2, 9),
        title: session.gameType.charAt(0).toUpperCase() + session.gameType.slice(1) + ' Game',
        amount: earnedCoins,
        date: now.toISOString(),
      });
      if (newStats.rewardsHistory.length > 50) {
        newStats.rewardsHistory = newStats.rewardsHistory.slice(0, 50);
      }

      if (session.score > newStats.highScores[session.gameType]) {
        newStats.highScores[session.gameType] = session.score;
      }

      const isFirstPlayToday = !newStats.streakHistory.includes(todayStr);

      if (isFirstPlayToday) {
        newStats.streakHistory.push(todayStr);
      }
      
      newStats.lastPlayedDate = todayStr;

      // Re-calculate robustly
      const { current, longest } = calculateStreaksFromHistory(newStats.streakHistory, todayStr);
      newStats.dailyStreak = current;
      newStats.longestStreak = Math.max(newStats.longestStreak || 0, longest);

      if (isFirstPlayToday) {
        const streakBonus = Math.min(50, newStats.dailyStreak * 5);
        newStats.novaCoins += streakBonus;
        newStats.rewardsHistory.unshift({
          id: Math.random().toString(36).substring(2, 9),
          title: `Daily Streak (${newStats.dailyStreak} days)`,
          amount: streakBonus,
          date: now.toISOString(),
        });
      }

      const existingDayIndex = newStats.weeklyPerformance.findIndex(p => p.date === todayStr);
      if (existingDayIndex >= 0) {
        newStats.weeklyPerformance[existingDayIndex].score += session.score;
      } else {
        newStats.weeklyPerformance.push({ date: todayStr, score: session.score });
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
    recordGame,
  };
}
