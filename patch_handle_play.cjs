const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  const handlePlayGame = (gameId: string) => {
    setActiveGameDetails(gameId);
  };`;

const replaceStr = `  const handlePlayGame = (gameId: string) => {
    const game = allGames.find(g => g.id === gameId);
    const isPro = localStorage.getItem('brainova_is_pro') === 'true';
    if (game && (game as any).isPremium && !isPro) {
      setIsPremiumSubscriptionOpen(true);
      return;
    }
    setActiveGameDetails(gameId);
  };`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log('patched handlePlayGame');
} else {
  console.log('target not found for handlePlayGame');
}
