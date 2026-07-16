const fs = require('fs');
let content = fs.readFileSync('src/components/RecommendedTraining.tsx', 'utf8');

content = content.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, Crown } from 'lucide-react';");
content = content.replace(/<svg xmlns="http:\/\/www.w3.org\/2000\/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-\[\#f59e0b\]">\s*<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"\/>\s*<\/svg>/, '<Crown className="w-5 h-5 text-[#f59e0b]" />');

fs.writeFileSync('src/components/RecommendedTraining.tsx', content);
console.log('patched recommended crown');
