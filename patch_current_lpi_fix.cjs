const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldLine = `Object.values(stats.highScores).reduce((sum, score) => sum + (score || 0), 0) / 10`;
const newLine = `(Object.values(stats.highScores) as number[]).reduce((sum, score) => sum + (score || 0), 0) / 10`;

content = content.replace(oldLine, newLine);
fs.writeFileSync('src/App.tsx', content);
console.log("Patched currentLpi type");
