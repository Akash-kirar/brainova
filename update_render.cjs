const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

// Also need Gamepad2 and Play imports from lucide-react if not present.
const importMatch = content.match(/import \{([^}]+)\} from 'lucide-react';/);
if (importMatch) {
  let imports = importMatch[1];
  if (!imports.includes('Gamepad2')) imports += ', Gamepad2';
  if (!imports.includes('Play')) imports += ', Play';
  content = content.replace(importMatch[0], "import {" + imports + "} from 'lucide-react';");
}

fs.writeFileSync('src/components/AiCoachView.tsx', content);
