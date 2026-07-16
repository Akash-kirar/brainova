const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "{ id: 1, title: 'Beginner', xp: '0', maxXP: '100', x: 240, y: 3990, icon: Flag, color: '#10b981', labelColor: '#34d399', labelPos: 'left' }",
  "{ id: 1, title: 'Beginner', xp: '0', maxXP: '50', x: 240, y: 3990, icon: Flag, color: '#10b981', labelColor: '#34d399', labelPos: 'left' }"
);

content = content.replace(
  "{ level: 1, title: 'Beginner', maxXP: 100 },",
  "{ level: 1, title: 'Beginner', maxXP: 50 },"
);

fs.writeFileSync('src/App.tsx', content);
console.log("Beginner maxXP patched.");
