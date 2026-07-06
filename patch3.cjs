const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change totalXP to 36
code = code.replace(/acc \+ curr\.score, 0\) \|\| 200/g, 'acc + curr.score, 0) || 36');
code = code.replace(/acc \+ curr\.score, 0\) \|\| 400/g, 'acc + curr.score, 0) || 36');
code = code.replace(/acc \+ curr\.score, 0\) \|\| 360/g, 'acc + curr.score, 0) || 36');

// Change Level 1 maxXP to 100
code = code.replace(/{ id: 1, title: 'Beginner', xp: '0', maxXP: '400'/g, "{ id: 1, title: 'Beginner', xp: '0', maxXP: '100'");
code = code.replace(/{ id: 1, title: 'Beginner', xp: '0', maxXP: '200'/g, "{ id: 1, title: 'Beginner', xp: '0', maxXP: '100'");

// Update levelThresholds to match
code = code.replace(/{ level: 1, title: 'Beginner', maxXP: 400 }/g, "{ level: 1, title: 'Beginner', maxXP: 100 }");
code = code.replace(/{ level: 1, title: 'Beginner', maxXP: 200 }/g, "{ level: 1, title: 'Beginner', maxXP: 100 }");

// Change Level 2 xp to 100 and maxXP to 300
code = code.replace(/{ id: 2, title: 'Learner', xp: '400', maxXP: '800'/g, "{ id: 2, title: 'Learner', xp: '100', maxXP: '300'");

// Update levelThresholds to match
code = code.replace(/{ level: 2, title: 'Learner', maxXP: 800 }/g, "{ level: 2, title: 'Learner', maxXP: 300 }");

fs.writeFileSync('src/App.tsx', code);
