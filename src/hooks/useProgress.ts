import { useState, useEffect } from 'react';

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
}

const DEFAULT_STATS: UserStats = {
  dailyStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  totalGamesPlayed: 0,
  novaCoins: 0,
  highScores: { memory: 0, speed: 0, focus: 0, logic: 0, math: 0, language: 0, visual: 0, observation: 0, executive: 0, creativity: 0 },
  weeklyPerformance: [],
  streakHistory: [],
};

export function useProgress() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [sessions, setSessions] = useState<GameSession[]>([]);

  // Load data on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('brainova_stats_v2');
    
    // Clear old sample data if it contains 1250 memory score
    if (savedStats && savedStats.includes('"memory":1250')) {
      localStorage.removeItem('brainova_stats_v2');
      localStorage.removeItem('brainova_sessions_v2');
      return; // Will use DEFAULT_STATS and empty sessions
    }
  
    const savedSessions = localStorage.getItem('brainova_sessions_v2');
    
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }
    
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('brainova_stats_v2', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('brainova_sessions_v2', JSON.stringify(sessions));
  }, [sessions]);

  const recordGame = (session: Omit<GameSession, 'id' | 'timestamp'>) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const newSession: GameSession = {
      ...session,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: now.getTime(),
    };

    setSessions(prev => [...prev, newSession]);

    setStats(prev => {
      const newStats = { ...prev };
      
      // Update total games
      newStats.totalGamesPlayed += 1;
      newStats.novaCoins = (newStats.novaCoins || 0) + Math.max(10, Math.floor(session.score / 5));

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
