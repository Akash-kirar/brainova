const lucide = require('lucide-react');
const icons = ['Rocket', 'Sword', 'Sun', 'Moon', 'Hexagon', 'Diamond', 'Infinity', 'Atom', 'Orbit', 'Activity', 'Award', 'Brain', 'Compass', 'Crown', 'Flame', 'Gem', 'Lightbulb', 'Shield', 'Sparkles', 'Star', 'Target', 'Trophy', 'Zap', 'Mountain', 'Dna', 'Eye', 'Ghost'];
const available = icons.filter(i => lucide[i]);
console.log("Available:", available.join(', '));
const missing = icons.filter(i => !lucide[i]);
console.log("Missing:", missing.join(', '));
