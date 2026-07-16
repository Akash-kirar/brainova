const fs = require('fs');
let content = fs.readFileSync('src/components/AiAnalysisPage.tsx', 'utf8');

content = content.replace('className="w-full h-[280px]"', 'className="w-full h-[380px]"');
content = content.replace('outerRadius="55%"', 'outerRadius="70%"');

fs.writeFileSync('src/components/AiAnalysisPage.tsx', content);
console.log('patched chart size');
