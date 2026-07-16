const fs = require('fs');
let content = fs.readFileSync('src/hooks/useProgress.ts', 'utf8');

const imports = `import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';`;

content = content.replace(/import { useState, useEffect } from 'react';/, imports);

const hookBody = `
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
`;

// we need to replace everything between `export function useProgress() {` and `setStats(prev => {`
// Wait, the regex replace needs to be precise.
let [before, after] = content.split('    setStats(prev => {');

// Everything before `setStats(prev => {` but after `export function useProgress() {`
let hookStart = before.split('export function useProgress() {');
let newBefore = hookStart[0] + 'export function useProgress() {\n' + hookBody;

content = newBefore + '      const newStats = { ...prev };' + after.substring(after.indexOf('const newStats'));

fs.writeFileSync('src/hooks/useProgress.ts', content);
console.log('patched useProgress');
