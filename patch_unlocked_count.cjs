const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const getUnlockedCountStr = `
  const getUnlockedCount = () => {
    let count = 0;
    if (stats.totalGamesPlayed > 0) count++;
    if (stats.longestStreak >= 7) count++;
    if (stats.highScores?.focus >= 80) count++;
    if (stats.totalGamesPlayed > 5) count++;
    return count;
  };
  const unlockedAchievementsCount = getUnlockedCount();
`;

// Insert the function somewhere inside App component
// We can insert it right before returning the UI
app = app.replace("return (", getUnlockedCountStr + "\n  return (");

// Replace "4 / 24" with "{unlockedAchievementsCount} / 24"
app = app.replace(
  /<span className="text-\[\#a855f7\] font-bold">4 \/ 24<\/span>/g,
  '<span className="text-[#a855f7] font-bold">{unlockedAchievementsCount} / 24</span>'
);

// Update <AchievementsPage onBack={() => setIsAchievementsOpen(false)} />
app = app.replace(
  /<AchievementsPage onBack=\{\(\) => setIsAchievementsOpen\(false\)\} \/>/g,
  '<AchievementsPage onBack={() => setIsAchievementsOpen(false)} stats={stats} />'
);

fs.writeFileSync('src/App.tsx', app);
