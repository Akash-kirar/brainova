const fs = require('fs');
let content = fs.readFileSync('src/hooks/useProgress.ts', 'utf8');

if (!content.includes('totalXp: number')) {
  content = content.replace('novaCoins: number;', 'novaCoins: number;\n  totalXp: number;');
  content = content.replace('novaCoins: 0,', 'novaCoins: 0,\n  totalXp: 0,');
}

// Ensure totalXp is updated on game complete
if (!content.includes('newStats.totalXp = (newStats.totalXp || 0) + session.score;')) {
  content = content.replace(
    /newStats\.totalGamesPlayed \+= 1;/,
    'newStats.totalGamesPlayed += 1;\n      newStats.totalXp = (newStats.totalXp || 0) + session.score;'
  );
}

fs.writeFileSync('src/hooks/useProgress.ts', content);
console.log("Updated useProgress.ts");
