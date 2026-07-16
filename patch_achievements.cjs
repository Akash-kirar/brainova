const fs = require('fs');
let content = fs.readFileSync('src/components/AchievementsPage.tsx', 'utf8');

const newAchievements = `    {
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
      date: 'Locked',
      unlocked: false,
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
      date: 'Locked',
      unlocked: false,
      hexagonBorder: 'border-[#fbbf24]'
    }
  ];`;

content = content.replace(/    \}\n  \];/, "    },\n" + newAchievements);
content = content.replace(/24/g, "34");

fs.writeFileSync('src/components/AchievementsPage.tsx', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/{unlockedAchievementsCount} \/ 24/g, "{unlockedAchievementsCount} / 34");
appContent = appContent.replace(/24 unlocked/g, "34 unlocked"); // just in case
fs.writeFileSync('src/App.tsx', appContent);

console.log('patched achievements');
