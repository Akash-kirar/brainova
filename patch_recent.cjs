const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldArray = `['All', 'Recent', 'Logic', 'Memory', 'Focus', 'Math', 'Reaction Speed', 'Language & Vocabulary', 'Visual & Spatial', 'Observation', 'Executive Function', 'Creativity']`;
const newArray = `['All', 'Logic', 'Memory', 'Focus', 'Math', 'Reaction Speed', 'Language & Vocabulary', 'Visual & Spatial', 'Observation', 'Executive Function', 'Creativity']`;
content = content.replace(oldArray, newArray);

const oldCondition = `if (activeCategoryFilter === 'All' || activeCategoryFilter === 'Recent') return true;`;
const newCondition = `if (activeCategoryFilter === 'All') return true;`;
content = content.replace(oldCondition, newCondition);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched Recent filter");
