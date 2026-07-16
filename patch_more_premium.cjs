const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const gamesToLock = [
  'find-different-shape',
  'odd-one-out',
  'focus-tap',
  'moving-target-tap',
  'color-match-focus',
  'find-hidden-object',
  'distraction-filter',
  'focus-circle',
  'visual-search',
  'target-finder',
  'focus-lines',
  'quick-select',
  'spot-difference',
  'multi-object-tracking',
  'attention-grid'
];

gamesToLock.forEach(gameId => {
  const regex = new RegExp("(id: '" + gameId + "'[\\\\s\\\\S]*?border: 'border-[a-z]+-500\\\\/20')", "g");
  content = content.replace(regex, "$1, isPremium: true");
});

fs.writeFileSync('src/App.tsx', content);
console.log('patched more games');
