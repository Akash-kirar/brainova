const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newGames = `  { id: 'shadow-match', title: 'Shadow Match', category: 'Observation', description: 'Match item to shadow', icon: <Search className="w-8 h-8 text-violet-400" />, color: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { id: 'find-identical', title: 'Find Identical', category: 'Observation', description: 'Find the exact match', icon: <Target className="w-8 h-8 text-fuchsia-400" />, color: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
  { id: 'shape-count', title: 'Shape Count', category: 'Observation', description: 'Count specific shapes', icon: <Box className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'color-anomaly', title: 'Color Anomaly', category: 'Observation', description: 'Spot the odd color', icon: <Sparkle className="w-8 h-8 text-sky-400" />, color: 'bg-sky-500/10', border: 'border-sky-500/20' },
  // Logic & Puzzle Games`;

content = content.replace(/\/\/ Logic & Puzzle Games/, newGames);
fs.writeFileSync('src/App.tsx', content);
console.log('added games to array');
