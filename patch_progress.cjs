const fs = require('fs');
let content = fs.readFileSync('src/hooks/useProgress.ts', 'utf8');

const newInterfaces = `export interface Reward {
  id: string;
  title: string;
  amount: number;
  date: string;
}

export interface GameSession {`;

content = content.replace('export interface GameSession {', newInterfaces);

content = content.replace(
  'streakHistory: string[];\n}',
  'streakHistory: string[];\n  rewardsHistory: Reward[];\n}'
);

content = content.replace(
  'streakHistory: [],\n};',
  'streakHistory: [],\n  rewardsHistory: [],\n};'
);

// We need to add rewards in recordGame
const oldUpdateCoins = 'newStats.novaCoins = (newStats.novaCoins || 0) + Math.max(10, Math.floor(session.score / 5));';
const newUpdateCoins = `      const earnedCoins = Math.max(10, Math.floor(session.score / 5));
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
      }`;
      
content = content.replace(oldUpdateCoins, newUpdateCoins);

// And for daily streak reward
const oldDailyStreakUpdate = `if (diffDays === 1) {
            // Played yesterday, increment streak
            newStats.dailyStreak += 1;
          }`;
const newDailyStreakUpdate = `if (diffDays === 1) {
            // Played yesterday, increment streak
            newStats.dailyStreak += 1;
            
            // Give streak bonus
            const streakBonus = Math.min(50, newStats.dailyStreak * 5);
            newStats.novaCoins += streakBonus;
            newStats.rewardsHistory.unshift({
              id: Math.random().toString(36).substring(2, 9),
              title: \`Daily Streak (\${newStats.dailyStreak} days)\`,
              amount: streakBonus,
              date: now.toISOString()
            });
          }`;

content = content.replace(oldDailyStreakUpdate, newDailyStreakUpdate);

fs.writeFileSync('src/hooks/useProgress.ts', content);
