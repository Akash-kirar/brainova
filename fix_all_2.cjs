const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/<KickOffQuest onBack=\{\(\) => setPlanStep\(0\)\} onSkip=\{\(\) => setIsPlanGeneratorOpen\(false\)\} \/>/g, '<KickOffQuest onBack={() => setPlanStep(0)} />');
fs.writeFileSync('src/App.tsx', code);

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
i18n = i18n.replace(/export const languages = \[\s*\{ code: 'en', label: 'English' \},\s*\{ code: 'hi', label: 'हिंदी' \},\s*\{ code: 'bn', label: 'বাংলা' \},\s*\{ code: 'mr', label: 'मराठी' \},\s*\{ code: 'te', label: 'తెలుగు' \},\s*\{ code: 'ta', label: 'தமிழ்' \},\s*\{ code: 'kn', label: 'ಕನ್ನಡ' \}\s*\];/g, 
  "export const languages = [ { code: 'en', label: 'English' }, { code: 'hi', label: 'हिंदी' }, { code: 'bn', label: 'বাংলা' }, { code: 'mr', label: 'मराठी' }, { code: 'te', label: 'తెలుగు' }, { code: 'ta', label: 'தமிழ்' } ];");
fs.writeFileSync('src/i18n.ts', i18n);

