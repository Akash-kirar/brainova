const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the heights and viewBoxes
content = content.replace(/h-\[4080px\]/g, 'h-[4050px]');
content = content.replace(/viewBox="0 0 400 4080"/g, 'viewBox="0 0 400 4050"');
content = content.replace(/height="4080"/g, 'height="4050"');

// Replace the bottom y-coordinates of the earth/space paths
content = content.replace(/L 440,4080 L -20,4080/g, 'L 440,4050 L -20,4050');
content = content.replace(/L440,4080 L-20,4080/g, 'L440,4050 L-20,4050');

// Fix node position calculations
content = content.replace(/node\.y \/ 4080/g, 'node.y / 4050');

fs.writeFileSync('src/App.tsx', content);
console.log('patched height');
