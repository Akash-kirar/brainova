const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldHandleWrapper = `  const handleGameCompleteWrapper = (session: Omit<GameSession, 'id' | 'timestamp'>) => {
    recordGame({
      ...session,
      gameId: activeGame || undefined
    });
    if (session.score >= 30) { // Set threshold for high score
      setCelebrationData({
        score: session.score,
        coins: Math.max(10, Math.floor(session.score / 5))
      });
    }
  };`;

const newHandleWrapper = `  const handleGameCompleteWrapper = (session: Omit<GameSession, 'id' | 'timestamp'>) => {
    const prevDate = stats.lastPlayedDate;
    const today = new Date().toISOString().split('T')[0];
    const isNewStreak = prevDate !== today;

    recordGame({
      ...session,
      gameId: activeGame || undefined
    });
    
    if (session.score >= 30) { // Set threshold for high score
      setCelebrationData({
        score: session.score,
        coins: Math.max(10, Math.floor(session.score / 5)),
        streak: isNewStreak ? 1 : 0
      });
    }
  };`;

content = content.replace(oldHandleWrapper, newHandleWrapper);

content = content.replace(
  'const [celebrationData, setCelebrationData] = useState<{score: number, coins: number} | null>(null);',
  'const [celebrationData, setCelebrationData] = useState<{score: number, coins: number, streak?: number} | null>(null);'
);

content = content.replace(
  '<CelebrationOverlay\n            score={celebrationData.score}\n            coins={celebrationData.coins}\n            onClose={() => setCelebrationData(null)}\n          />',
  '<CelebrationOverlay\n            score={celebrationData.score}\n            coins={celebrationData.coins}\n            streak={celebrationData.streak}\n            onClose={() => setCelebrationData(null)}\n          />'
);

fs.writeFileSync('src/App.tsx', content);
