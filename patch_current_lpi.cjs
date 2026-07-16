const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldCurrentLpi = `  const currentLpi = {
    overall: Math.round(((stats.highScores.speed || 0) + (stats.highScores.memory || 0) + (stats.highScores.focus || 0) + (stats.highScores.logic || 0) + (stats.highScores.math || 0)) / 5) || 0,
    speed: stats.highScores.speed || 0,
    memory: stats.highScores.memory || 0,
    attention: stats.highScores.focus || 0,
    flexibility: stats.highScores.logic || 0,
    math: stats.highScores.math || 0
  };`;

const newCurrentLpi = `  const currentLpi = {
    overall: Math.round(
      Object.values(stats.highScores).reduce((sum, score) => sum + (score || 0), 0) / 10
    ) || 0,
    speed: stats.highScores.speed || 0,
    memory: stats.highScores.memory || 0,
    focus: stats.highScores.focus || 0,
    logic: stats.highScores.logic || 0,
    math: stats.highScores.math || 0,
    language: stats.highScores.language || 0,
    visual: stats.highScores.visual || 0,
    observation: stats.highScores.observation || 0,
    executive: stats.highScores.executive || 0,
    creativity: stats.highScores.creativity || 0
  };`;

content = content.replace(oldCurrentLpi, newCurrentLpi);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched currentLpi");
