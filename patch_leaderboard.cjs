const fs = require('fs');
let content = fs.readFileSync('src/components/LeaderboardPage.tsx', 'utf8');

content = content.replace(
  "{ name: 'Rohit', xp: \`\${fakeXp.toLocaleString()} XP\`, image: 'https://i.pravatar.cc/150?u=1' },",
  "{ name: 'Rohit', xp: \`\${fakeXp.toLocaleString()} XP\`, image: 'https://i.pravatar.cc/150?u=1', isCurrentUser: false },"
).replace(
  "{ name: 'Neha', xp: \`\${fakeXp.toLocaleString()} XP\`, image: 'https://i.pravatar.cc/150?u=2' },",
  "{ name: 'Neha', xp: \`\${fakeXp.toLocaleString()} XP\`, image: 'https://i.pravatar.cc/150?u=2', isCurrentUser: false },"
).replace(
  "{ name: 'Arjun', xp: \`\${fakeXp.toLocaleString()} XP\`, image: 'https://i.pravatar.cc/150?u=3' }",
  "{ name: 'Arjun', xp: \`\${fakeXp.toLocaleString()} XP\`, image: 'https://i.pravatar.cc/150?u=3', isCurrentUser: false }"
);

fs.writeFileSync('src/components/LeaderboardPage.tsx', content);
console.log('Leaderboard patched');
