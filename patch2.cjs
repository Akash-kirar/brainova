const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change totalXP to 200
code = code.replace(/acc \+ curr\.score, 0\) \|\| 400/g, 'acc + curr.score, 0) || 200');

// Change Level 1 maxXP and Level 2 xp to 400
code = code.replace(/{ id: 2, title: 'Learner', xp: '200', maxXP: '600'/g, "{ id: 2, title: 'Learner', xp: '400', maxXP: '800'");
code = code.replace(/{ id: 1, title: 'Beginner', xp: '0', maxXP: '200'/g, "{ id: 1, title: 'Beginner', xp: '0', maxXP: '400'");

// Update levelThresholds to match
code = code.replace(/{ level: 1, title: 'Beginner', maxXP: 200 }/g, "{ level: 1, title: 'Beginner', maxXP: 400 }");
code = code.replace(/{ level: 2, title: 'Learner', maxXP: 600 }/g, "{ level: 2, title: 'Learner', maxXP: 800 }");

fs.writeFileSync('src/App.tsx', code);
