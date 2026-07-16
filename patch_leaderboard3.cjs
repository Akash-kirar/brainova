const fs = require('fs');
let file = fs.readFileSync('src/components/LeaderboardPage.tsx', 'utf8');

file = file.replace(/player\.isCurrentUser/g, '((player as any).isCurrentUser)');

fs.writeFileSync('src/components/LeaderboardPage.tsx', file);
console.log("LeaderboardPage patched");
