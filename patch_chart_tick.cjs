const fs = require('fs');
let content = fs.readFileSync('src/components/AiAnalysisPage.tsx', 'utf8');

content = content.replace('fontSize={11}', 'fontSize={12}');

fs.writeFileSync('src/components/AiAnalysisPage.tsx', content);
console.log('patched chart tick');
