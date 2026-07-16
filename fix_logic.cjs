const fs = require('fs');
let content = fs.readFileSync('src/components/AchievementsPage.tsx', 'utf8');

// Replacements
content = content.replace(
  /date: 'Locked',\s*unlocked: false,\s*hexagonBorder: 'border-\[\#a855f7\]'\s*\}\s*,\s*\{\s*id: 'early_riser'/g,
  `date: stats.totalXp >= 1000 ? 'Unlocked' : 'Locked',
      unlocked: stats.totalXp >= 1000,
      hexagonBorder: 'border-[#a855f7]'
    },
    {
      id: 'early_riser'`
);

content = content.replace(
  /date: 'Locked',\s*unlocked: false,\s*hexagonBorder: 'border-\[\#f97316\]'\s*\}\s*,\s*\{\s*id: 'perfect_week'/g,
  `date: stats.highScores.logic >= 2000 ? 'Unlocked' : 'Locked',
      unlocked: stats.highScores.logic >= 2000,
      hexagonBorder: 'border-[#f97316]'
    },
    {
      id: 'perfect_week'`
);

content = content.replace(
  /id: 'dedicated_mind',([\s\S]*?)date: 'Locked',([\s\S]*?)unlocked: false,/g,
  `id: 'dedicated_mind',$1date: stats.longestStreak >= 14 ? 'Unlocked' : 'Locked',$2unlocked: stats.longestStreak >= 14,`
);

content = content.replace(
  /id: 'habit_builder',([\s\S]*?)date: 'Locked',([\s\S]*?)unlocked: false,/g,
  `id: 'habit_builder',$1date: stats.longestStreak >= 30 ? 'Unlocked' : 'Locked',$2unlocked: stats.longestStreak >= 30,`
);

content = content.replace(
  /id: 'century_mark',([\s\S]*?)date: 'Locked',([\s\S]*?)unlocked: false,/g,
  `id: 'century_mark',$1date: stats.totalGamesPlayed >= 100 ? 'Unlocked' : 'Locked',$2unlocked: stats.totalGamesPlayed >= 100,`
);

content = content.replace(
  /id: 'elite_mind',([\s\S]*?)date: 'Locked',([\s\S]*?)unlocked: false,/g,
  `id: 'elite_mind',$1date: stats.totalXp >= 10000 ? 'Unlocked' : 'Locked',$2unlocked: stats.totalXp >= 10000,`
);

content = content.replace(
  /id: 'grand_master',([\s\S]*?)date: 'Locked',([\s\S]*?)unlocked: false,/g,
  `id: 'grand_master',$1date: stats.totalXp >= 50000 ? 'Unlocked' : 'Locked',$2unlocked: stats.totalXp >= 50000,`
);

content = content.replace(
  /id: 'loyal_member',([\s\S]*?)date: 'Locked',([\s\S]*?)unlocked: false,/g,
  `id: 'loyal_member',$1date: stats.streakHistory.length >= 100 ? 'Unlocked' : 'Locked',$2unlocked: stats.streakHistory.length >= 100,`
);


fs.writeFileSync('src/components/AchievementsPage.tsx', content);

console.log('patched logic');
