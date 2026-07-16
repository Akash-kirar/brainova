const fs = require('fs');
let content = fs.readFileSync('src/components/AiAnalysisPage.tsx', 'utf8');

const targetStr = `    return [
      { subject: 'Memory', A: calculateScore(stats.highScores.memory), color: '#c084fc', fullMark: 100 },
      { subject: 'Focus', A: calculateScore(stats.highScores.focus), color: '#f472b6', fullMark: 100 },
      { subject: 'Speed', A: calculateScore(stats.highScores.speed), color: '#c084fc', fullMark: 100 },
      { subject: 'Recall', A: calculateScore(stats.highScores.language), color: '#60a5fa', fullMark: 100 },
      { subject: 'Logic', A: calculateScore(stats.highScores.logic), color: '#c084fc', fullMark: 100 },
      { subject: 'Math Solving', A: calculateScore(stats.highScores.math), color: '#f472b6', fullMark: 100 },
    ];`;

const replaceStr = `    return [
      { subject: 'Memory', A: calculateScore(stats.highScores.memory), color: '#c084fc', fullMark: 100 },
      { subject: 'Focus', A: calculateScore(stats.highScores.focus), color: '#f472b6', fullMark: 100 },
      { subject: 'Speed', A: calculateScore(stats.highScores.speed), color: '#c084fc', fullMark: 100 },
      { subject: 'Language', A: calculateScore(stats.highScores.language), color: '#60a5fa', fullMark: 100 },
      { subject: 'Logic', A: calculateScore(stats.highScores.logic), color: '#c084fc', fullMark: 100 },
      { subject: 'Math', A: calculateScore(stats.highScores.math), color: '#f472b6', fullMark: 100 },
      { subject: 'Visual', A: calculateScore(stats.highScores.visual), color: '#34d399', fullMark: 100 },
      { subject: 'Observation', A: calculateScore(stats.highScores.observation), color: '#fcd34d', fullMark: 100 },
      { subject: 'Executive', A: calculateScore(stats.highScores.executive), color: '#fb923c', fullMark: 100 },
      { subject: 'Creativity', A: calculateScore(stats.highScores.creativity), color: '#a78bfa', fullMark: 100 },
    ];`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/AiAnalysisPage.tsx', content);
  console.log('patched chart data');
} else {
  console.log('target not found for chart data');
}
