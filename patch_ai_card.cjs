const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldCard = `<div className="mt-6 p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-4">`;
const newCard = `<div onClick={() => setIsPlanGeneratorOpen(true)} className="mt-6 p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 rounded-2xl flex items-start gap-4 cursor-pointer transition-colors">`;

content = content.replace(oldCard, newCard);
fs.writeFileSync('src/App.tsx', content);
console.log("Patched AI Recommendation card");
