const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetImport = "import VisualSearchGame from '@/src/features/observation/components/VisualSearchGame';";
const newImports = `import VisualSearchGame from '@/src/features/observation/components/VisualSearchGame';
import ShadowMatchGame from '@/src/features/observation/components/ShadowMatchGame';
import FindIdenticalGame from '@/src/features/observation/components/FindIdenticalGame';
import ShapeCountGame from '@/src/features/observation/components/ShapeCountGame';
import ColorAnomalyGame from '@/src/features/observation/components/ColorAnomalyGame';`;

content = content.replace(targetImport, newImports);

const targetSwitch = `          ) : activeGame === 'visual-search' ? (
            <VisualSearchGame difficulty={gameDifficulty}
              onBack={handleBackFromGame}
              onGameComplete={(score, maxLevel) => handleGameCompleteWrapper({ gameType: 'observation', score, difficulty: 'normal', maxLevel })}
            />`;

const newSwitch = `          ) : activeGame === 'visual-search' ? (
            <VisualSearchGame difficulty={gameDifficulty}
              onBack={handleBackFromGame}
              onGameComplete={(score, maxLevel) => handleGameCompleteWrapper({ gameType: 'observation', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'shadow-match' ? (
            <ShadowMatchGame difficulty={gameDifficulty}
              onBack={handleBackFromGame}
              onGameComplete={(score, maxLevel) => handleGameCompleteWrapper({ gameType: 'observation', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'find-identical' ? (
            <FindIdenticalGame difficulty={gameDifficulty}
              onBack={handleBackFromGame}
              onGameComplete={(score, maxLevel) => handleGameCompleteWrapper({ gameType: 'observation', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'shape-count' ? (
            <ShapeCountGame difficulty={gameDifficulty}
              onBack={handleBackFromGame}
              onGameComplete={(score, maxLevel) => handleGameCompleteWrapper({ gameType: 'observation', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'color-anomaly' ? (
            <ColorAnomalyGame difficulty={gameDifficulty}
              onBack={handleBackFromGame}
              onGameComplete={(score, maxLevel) => handleGameCompleteWrapper({ gameType: 'observation', score, difficulty: 'normal', maxLevel })}
            />`;

content = content.replace(targetSwitch, newSwitch);
fs.writeFileSync('src/App.tsx', content);
console.log('patched App.tsx');
