const fs = require('fs');
let content = fs.readFileSync('src/hooks/useProgress.ts', 'utf8');
content = content.replace('const newStats = { ...prev };const newStats = { ...prev };', 'const newStats = { ...prev };');
fs.writeFileSync('src/hooks/useProgress.ts', content);
console.log('fixed');
