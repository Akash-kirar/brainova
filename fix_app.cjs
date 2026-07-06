const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/<KickOffQuest[\s\S]*?\/>/, '<KickOffQuest onBack={() => setPlanStep(0)} />');
fs.writeFileSync('src/App.tsx', code);
