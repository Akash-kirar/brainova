const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const files = walkDir('src/features').filter(f => f.endsWith('Game.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add difficulty to interface
  if (!content.includes("difficulty?: 'easy' | 'medium' | 'hard';")) {
    content = content.replace(/interface\s+(\w+GameProps)\s*\{/g, (match, p1) => {
      changed = true;
      return `interface ${p1} {\n  difficulty?: 'easy' | 'medium' | 'hard';`;
    });
  }

  // Add difficulty to component destructuring
  if (!content.includes("difficulty = 'easy'")) {
    content = content.replace(/export default function\s+(\w+Game)\s*\(\{\s*([^}]+?)\s*\}\s*:\s*(\w+GameProps)\)/g, (match, p1, p2, p3) => {
      changed = true;
      return `export default function ${p1}({ ${p2}, difficulty = 'easy' }: ${p3})`;
    });
  }

  // Adjust initial level if it exists
  if (content.includes('useState(1)') && content.includes('setLevel')) {
    content = content.replace(/const\s+\[level,\s*setLevel\]\s*=\s*useState\(\s*1\s*\);/, "const [level, setLevel] = useState(difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 1);");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
