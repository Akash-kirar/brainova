const fs = require('fs');
let content = fs.readFileSync('src/components/AchievementsPage.tsx', 'utf8');
const matches = content.match(/34/g);
console.log(matches ? matches.length : 0);
