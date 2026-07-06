const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace totalXP hardcoded 360 with 400
code = code.replace(/acc \+ curr\.score, 0\) \|\| 360/g, 'acc + curr.score, 0) || 400');

// Replace label to show partial xp
const oldLabel = "{isCurrent ? `${totalXP} / ${node.maxXP || node.xp} XP` : node.status === 'completed' ? '100%' : `${node.xp} XP`}";
const newLabel = "{isCurrent ? `${totalXP - (parseInt(node.xp) || 0)} / ${parseInt(node.maxXP || node.xp) - (parseInt(node.xp) || 0)} XP` : node.status === 'completed' ? '100%' : `${node.xp} XP`}";
code = code.replace(oldLabel, newLabel);

fs.writeFileSync('src/App.tsx', code);
