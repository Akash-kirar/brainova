const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldStr = `const labels = {
                            speed: 'Speed',`;
const newStr = `const labels = {
                            speed: 'Reaction Speed',`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('src/App.tsx', content);
console.log("Patched label Speed to Reaction Speed");
