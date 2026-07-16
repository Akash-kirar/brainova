const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /  const CategoryScoreCard = \(\{ title, score, icon: Icon, iconColor, iconBgColor, barColor \}: any\) => \{\n    const \{ level, rank, filled, partial \} = getCategoryRank\(score\);\n      \n    const getUnlockedCount = \(\) => \{\n    let count = 0;\n    if \(stats\.totalGamesPlayed > 0\) count\+\+;\n    if \(stats\.longestStreak >= 7\) count\+\+;\n    if \(stats\.highScores\?\.focus >= 80\) count\+\+;\n    if \(stats\.totalGamesPlayed > 5\) count\+\+;\n    return count;\n  \};\n  const unlockedAchievementsCount = getUnlockedCount\(\);/g;

const newStr = `  const getUnlockedCount = () => {
    let count = 0;
    if (stats.totalGamesPlayed > 0) count++;
    if (stats.longestStreak >= 7) count++;
    if (stats.highScores?.focus >= 80) count++;
    if (stats.totalGamesPlayed > 5) count++;
    return count;
  };
  const unlockedAchievementsCount = getUnlockedCount();

  const CategoryScoreCard = ({ title, score, icon: Icon, iconColor, iconBgColor, barColor }: any) => {
    const { level, rank, filled, partial } = getCategoryRank(score);
`;

const res = appContent.replace(regex, newStr);
if (res === appContent) {
  console.log("No replace happened!");
} else {
  console.log("Replace success!");
}
fs.writeFileSync('src/App.tsx', res);
