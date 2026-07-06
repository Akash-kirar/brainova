const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');
code = code.replace(/export type Language = 'en' \| 'hi' \| 'bn' \| 'mr' \| 'te' \| 'ta' \| 'kn';/g, "export type Language = 'en' | 'hi' | 'bn' | 'mr' | 'te' | 'ta';");
fs.writeFileSync('src/i18n.ts', code);
