const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add scroll-smooth to modal
const oldModalClass = `className="bg-[#1e2330] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"`;
const newModalClass = `className="bg-[#1e2330] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative max-h-[90vh] overflow-y-auto scroll-smooth hide-scrollbar"`;
content = content.replace(oldModalClass, newModalClass);

// Add scroll-smooth to categories
const oldCategories = `className="flex overflow-x-auto hide-scrollbar gap-4 pb-6 pt-2 -mx-6 px-6 items-center"`;
const newCategories = `className="flex overflow-x-auto hide-scrollbar scroll-smooth gap-4 pb-6 pt-2 -mx-6 px-6 items-center"`;
content = content.replace(oldCategories, newCategories);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched scroll smooth");
