const fs = require('fs');
let content = fs.readFileSync('src/components/LeaderboardPage.tsx', 'utf8');

const oldFunc = `  const generateFakeUser = (rank: number, index: number) => {
    const fakeXp = Math.max(0, totalXP + ((userRank - rank) * 10) + Math.floor(Math.random() * 5)); 
    return {
      rank,
      name: names[index % names.length],
      xp: \`\${fakeXp.toLocaleString()} XP\`,
      image: \`https://i.pravatar.cc/150?u=\${rank}\`,
    };
  };`;

const newFunc = `  const generateFakeUser = (rank: number, index: number) => {
    const baseFakeXp = totalXP === 0 ? 9250 : totalXP; 
    const fakeXp = Math.max(0, baseFakeXp + ((userRank - rank) * 610) + Math.floor(Math.random() * 50)); 
    return {
      rank,
      name: names[index % names.length],
      xp: \`\${fakeXp.toLocaleString()} XP\`,
      image: \`https://i.pravatar.cc/150?u=\${rank}\`,
    };
  };`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('src/components/LeaderboardPage.tsx', content);
