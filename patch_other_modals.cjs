const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldModal1 = `className="bg-[#2c1b00] border border-[#ff9900]/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"`;
const newModal1 = `className="bg-[#2c1b00] border border-[#ff9900]/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative max-h-[90vh] overflow-y-auto scroll-smooth hide-scrollbar"`;

const oldModal2 = `className="bg-[#1a1a1c] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"`;
const newModal2 = `className="bg-[#1a1a1c] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative max-h-[90vh] overflow-y-auto scroll-smooth hide-scrollbar"`;

content = content.replace(oldModal1, newModal1);
content = content.replace(oldModal2, newModal2);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched other modals");
