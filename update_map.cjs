const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const iconMapping = {
  1: 'Sparkles',
  2: 'Brain',
  3: 'Zap',
  4: 'Target',
  5: 'Activity',
  6: 'Lightbulb',
  7: 'Compass',
  8: 'Flame',
  9: 'Award',
  10: 'Trophy',
  11: 'Star',
  12: 'Crown',
  13: 'Gem',
  14: 'Shield',
  15: 'Rocket',
  16: 'Sword',
  17: 'Sun',
  18: 'Moon',
  19: 'Hexagon',
  20: 'Octagon',
  21: 'Diamond',
  22: 'Triangle',
  23: 'Infinity',
  24: 'Orbit',
  25: 'Atom'
};

// Also we need to make sure these icons are imported!
// Let's replace the `import { ... } from 'lucide-react'` with everything we need.
// We can just find the lucide-react import and add the missing ones.
const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/;
let match = content.match(importRegex);
if (match) {
  let existingImports = match[1].split(',').map(s => s.trim());
  Object.values(iconMapping).forEach(icon => {
    if (!existingImports.includes(icon)) {
      existingImports.push(icon);
    }
  });
  let newImport = `import { ${existingImports.join(', ')} } from 'lucide-react'`;
  content = content.replace(importRegex, newImport);
}

// Now replace icon: Lock with icon: IconName in mapNodesBase
content = content.replace(/const mapNodesBase = \[([\s\S]*?)\];/, (match, p1) => {
  let replaced = p1;
  for (let i = 1; i <= 25; i++) {
    const icon = iconMapping[i];
    const regex = new RegExp(`(\\{ id: ${i},.*?icon: )Lock(.*?\\})`, 'g');
    replaced = replaced.replace(regex, `$1${icon}$2`);
  }
  return `const mapNodesBase = [${replaced}];`;
});

// Now we update the rendering logic
// We want to show the specific icon instead of Check or Number.
/*
                                {isCompleted ? (
                                  <Check className="w-8 h-8 text-white stroke-[3px]" />
                                ) : isCurrent ? (
                                  <div className="absolute inset-2 rounded-full flex items-center justify-center" style={{ backgroundColor: node.color }}>
                                    <span className="text-white font-bold text-[22px]">{node.id}</span>
                                  </div>
                                ) : (
                                  <Lock className="w-5 h-5" style={{ color: '#ffffff' }} />
                                )}
*/

// Let's replace this block in App.tsx:
const renderRegex = /\{isCompleted \? \([\s\S]*?<Check className="w-8 h-8 text-white stroke-\[3px\]" \/>[\s\S]*?\) : isCurrent \? \([\s\S]*?<span className="text-white font-bold text-\[22px\]">\{node.id\}<\/span>[\s\S]*?\) : \([\s\S]*?<Lock className="w-5 h-5" style=\{\{ color: '#ffffff' \}\} \/>[\s\S]*?\)\}/;

const newRender = `{isCompleted ? (
                                  <Icon className="w-8 h-8 text-white drop-shadow-md" style={{ filter: \`drop-shadow(0 0 8px \${node.color})\` }} strokeWidth={2.5} />
                                ) : isCurrent ? (
                                  <div className="absolute inset-[3px] rounded-full flex items-center justify-center bg-[#0a0a10]">
                                    <Icon className="w-7 h-7" style={{ color: node.color, filter: \`drop-shadow(0 0 10px \${node.color})\` }} strokeWidth={2.5} />
                                  </div>
                                ) : (
                                  <Lock className="w-5 h-5" style={{ color: '#ffffff' }} />
                                )}`;

content = content.replace(renderRegex, newRender);

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Done!');
