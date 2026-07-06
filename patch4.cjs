const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/icon: CheckCircle/g, 'icon: Flag');

fs.writeFileSync('src/App.tsx', code);
