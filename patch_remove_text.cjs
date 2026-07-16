const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const badText = `<p className="text-sm text-white/70 leading-relaxed">Your daily training routine is customized based on these 10 data points. We will focus on improving your specific cognitive goals and adapting to your stress and sleep levels.</p>`;

content = content.replace(badText, '');

fs.writeFileSync('src/App.tsx', content);
console.log("Removed text");
