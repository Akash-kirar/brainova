const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
if (!content.includes('LogOut')) {
  content = content.replace('ArrowLeft,', 'ArrowLeft, LogOut,');
}
content = content.replace('<ArrowLeft className="w-5 h-5 text-red-400" />', '<LogOut className="w-5 h-5 text-red-400" />');
fs.writeFileSync('src/App.tsx', content);
console.log('patched icon');
