const fs = require('fs');
let content = fs.readFileSync('src/components/AiAnalysisPage.tsx', 'utf8');

const targetStr = `                  {stats.highScores[item.subject.toLowerCase()] || 0}`;

const replaceStr = `                  {stats.highScores[(item.subject === 'Math Solving' ? 'math' : item.subject === 'Recall' ? 'language' : item.subject.toLowerCase())] || 0}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/AiAnalysisPage.tsx', content);
  console.log('patched chart detail map');
} else {
  console.log('target not found for chart detail map');
}
