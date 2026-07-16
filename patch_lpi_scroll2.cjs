const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldModalClass = `className="bg-[#1e2330] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"`;
const newModalClass = `className="bg-[#1e2330] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"`;

content = content.replace(oldModalClass, newModalClass);
fs.writeFileSync('src/App.tsx', content);
console.log("Patched LPI modal scroll");
