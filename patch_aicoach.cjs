const fs = require('fs');

let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const targetStr = `const languageInstruction = \`\\n\\n[System Instruction: The user's preferred language code is '\${speechLang}'. Please respond to this message in that language.]\`;`;

const replaceStr = `        const todayStr = new Date().toISOString().split('T')[0];
        const todayScore = sessions.filter(s => new Date(s.timestamp).toISOString().split('T')[0] === todayStr).reduce((acc, curr) => acc + curr.score, 0);
        
        const languageInstruction = \`\\n\\n[System Context: 
- User Profile Score / Total XP: \${totalXP}
- Today's Score: \${todayScore}
- Daily Streak: \${stats.dailyStreak || 0} days
- High Scores: \${JSON.stringify(stats.highScores)}
The user's preferred language code is '\${speechLang}'. Please respond in that language. You are a smart personal AI. Give responses ONLY in text. If the score is 0, explicitly acknowledge it. If the user asks for a 7-day plan, create one based on their current profile score and activity.]\`;`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/AiCoachView.tsx', content);
  console.log('patched AiCoachView');
} else {
  console.log('target not found in AiCoachView');
}
