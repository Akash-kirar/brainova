const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const fileGroups = {
  'features/memory/components': [
    'CardMatchGame.tsx', 'ColorMemoryGame.tsx', 'ImageMemoryGame.tsx',
    'MemoryGridGame.tsx', 'NumberRecallGame.tsx', 'PatternRecallGame.tsx',
    'SequenceRecallGame.tsx', 'WordMemoryGame.tsx', 'WordRecallGame.tsx'
  ],
  'features/reaction/components': [
    'ColorReactionGame.tsx', 'FastButtonGame.tsx', 'FlashTapGame.tsx',
    'FocusTapGame.tsx', 'ReactionLightGame.tsx', 'ReactionSpeedGame.tsx',
    'ReactionTapGame.tsx', 'ReactionTimerGame.tsx', 'SpeedCircleGame.tsx',
    'TapTheMovingDotGame.tsx'
  ],
  'features/vocabulary/components': [
    'MissingLetterGame.tsx', 'VocabularyBuilderGame.tsx', 'VocabularyMatchGame.tsx',
    'WordBuilderGame.tsx', 'WordSearchGame.tsx', 'WordSequenceGame.tsx', 'WordSpeedGame.tsx'
  ],
  'features/logic/components': [
    'CubeRotationPuzzleGame.tsx', 'EquationBuilderGame.tsx', 'HiddenPatternPuzzleGame.tsx',
    'MathSprintGame.tsx', 'NumberComparisonGame.tsx', 'OddOneOutGame.tsx',
    'PatternLogicGame.tsx', 'PuzzleMatchGame.tsx', 'SequenceLogicGame.tsx',
    'SlidingPuzzleGame.tsx', 'SmartGridPuzzleGame.tsx', 'ColorMatchFocusGame.tsx'
  ],
  'features/training/components': [
    'DailyTraining.tsx'
  ],
  'features/onboarding/components': [
    'OnboardingScreens.tsx', 'SplashAnimation.tsx'
  ],
  'components/ui': [
    'GameCarousel.tsx'
  ]
};

console.log("Creating directories...");
for (const dir of Object.keys(fileGroups)) {
  fs.mkdirSync(path.join(srcDir, dir), { recursive: true });
}

const allComponents = [];

console.log("Moving files...");
Object.entries(fileGroups).forEach(([dir, files]) => {
  files.forEach(f => {
    const oldPath = path.join(srcDir, 'components', f);
    const newPath = path.join(srcDir, dir, f);
    if(fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      allComponents.push({ file: f, newDir: dir });
      console.log(`Moved ${f} to ${dir}`);
    } else {
      console.warn(`File not found: ${oldPath}`);
    }
  });
});

console.log("Updating App.tsx imports...");
let appTsxPath = path.join(srcDir, 'App.tsx');
let appTsx = fs.readFileSync(appTsxPath, 'utf8');

allComponents.forEach(({file, newDir}) => {
  const componentName = file.replace('.tsx', '');
  const regex = new RegExp(`from\\s+['"]./components/${componentName}['"]`, 'g');
  appTsx = appTsx.replace(regex, `from '@/src/${newDir}/${componentName}'`);
});

fs.writeFileSync(appTsxPath, appTsx);
console.log("App.tsx updated!");

// Create backend and admin folders
fs.mkdirSync(path.join(__dirname, 'admin', 'src', 'features'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'backend', 'src', 'controllers'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'backend', 'src', 'routes'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'backend', 'src', 'models'), { recursive: true });

console.log("Directories created.");
