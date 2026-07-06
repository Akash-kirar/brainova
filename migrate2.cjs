// migrate2.cjs
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const componentLocations = {
  'CardMatchGame': 'memory',
  'ColorMemoryGame': 'memory',
  'ImageMemoryGame': 'memory',
  'MemoryGridGame': 'memory',
  'NumberRecallGame': 'memory',
  'PatternRecallGame': 'memory',
  'SequenceRecallGame': 'memory',
  'WordMemoryGame': 'memory',
  'WordRecallGame': 'memory',
  'ColorReactionGame': 'reaction',
  'FastButtonGame': 'reaction',
  'FlashTapGame': 'reaction',
  'FocusTapGame': 'reaction',
  'ReactionLightGame': 'reaction',
  'ReactionSpeedGame': 'reaction',
  'ReactionTapGame': 'reaction',
  'ReactionTimerGame': 'reaction',
  'SpeedCircleGame': 'reaction',
  'TapTheMovingDotGame': 'reaction',
  'MissingLetterGame': 'vocabulary',
  'VocabularyBuilderGame': 'vocabulary',
  'VocabularyMatchGame': 'vocabulary',
  'WordBuilderGame': 'vocabulary',
  'WordSearchGame': 'vocabulary',
  'WordSequenceGame': 'vocabulary',
  'WordSpeedGame': 'vocabulary',
  'CubeRotationPuzzleGame': 'logic',
  'EquationBuilderGame': 'logic',
  'HiddenPatternPuzzleGame': 'logic',
  'MathSprintGame': 'logic',
  'NumberComparisonGame': 'logic',
  'OddOneOutGame': 'logic',
  'PatternLogicGame': 'logic',
  'PuzzleMatchGame': 'logic',
  'SequenceLogicGame': 'logic',
  'SlidingPuzzleGame': 'logic',
  'SmartGridPuzzleGame': 'logic',
  'ColorMatchFocusGame': 'logic',
  'DailyTraining': 'training',
  'OnboardingScreens': 'onboarding',
  'SplashAnimation': 'onboarding',
  'GameCarousel': 'ui'
};

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace ./Component or ../components/Component with @/src/features/...
      for (const [compName, compCategory] of Object.entries(componentLocations)) {
        if (file.replace('.tsx','') === compName) continue; // Skip itself

        const prefixes = ['\\./', '\\.\\./components/', '\\.\\./\\.\\./components/'];
        for (const pfx of prefixes) {
          const regex = new RegExp(`from\\s+['"]${pfx}${compName}['"]`, 'g');
          if (regex.test(content)) {
            const targetPath = compCategory === 'ui' ? `@/src/components/ui/${compName}` : `@/src/features/${compCategory}/components/${compName}`;
            content = content.replace(regex, `from '${targetPath}'`);
            changed = true;
          }
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
