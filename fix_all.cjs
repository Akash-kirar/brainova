const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = 'const { stats, sessions, recordGame } = useProgress();';
const replacement = target + `
  const currentLpi = {
    overall: Math.round(((stats.highScores.speed || 0) + (stats.highScores.memory || 0) + (stats.highScores.focus || 0) + (stats.highScores.logic || 0) + (stats.highScores.math || 0)) / 5) || 0,
    speed: stats.highScores.speed || 0,
    memory: stats.highScores.memory || 0,
    attention: stats.highScores.focus || 0,
    flexibility: stats.highScores.logic || 0,
    math: stats.highScores.math || 0
  };
`;
code = code.replace(target, replacement);

// fix KickOffQuest onSkip error
code = code.replace(/<KickOffQuest onBack=\{\(\) => setPlanStep\(0\)\} onSkip=\{\(\) => setIsPlanGeneratorOpen\(false\)\} \/>/g, '<KickOffQuest onBack={() => setPlanStep(0)} />');

fs.writeFileSync('src/App.tsx', code);

// Fix LeaderboardPage isCurrentUser property
let leadCode = fs.readFileSync('src/components/LeaderboardPage.tsx', 'utf8');
leadCode = leadCode.replace(/isCurrentUser:/g, '// isCurrentUser:');
fs.writeFileSync('src/components/LeaderboardPage.tsx', leadCode);

