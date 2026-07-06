const fs = require('fs');

function removeTimeout(file) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  
  code = code.replace(
    /setTimeout\(\(\) => onGameComplete\(([^)]+)\), \d+\);/g,
    'onGameComplete($1);'
  );
  
  // QuickTestGame has setTimeout(() => onGameComplete(score, Math.floor(score/100) + 1), 1500)
  // MemorySprintGame has setTimeout(() => onGameComplete(score, maxLevel), 2000)
  
  fs.writeFileSync(file, code);
}

const files = [
  'src/features/quickactions/components/MathDrillGame.tsx',
  'src/features/quickactions/components/SmartGame.tsx',
  'src/features/quickactions/components/PlacementModeGame.tsx',
  'src/features/quickactions/components/QuickTestGame.tsx',
  'src/features/quickactions/components/MemorySprintGame.tsx',
  'src/features/memory/components/MemoryGridGame.tsx'
];

files.forEach(removeTimeout);

