const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the heights and viewBoxes
content = content.replace(/h-\[4200px\]/g, 'h-[4080px]');
content = content.replace(/viewBox="0 0 400 4200"/g, 'viewBox="0 0 400 4080"');
content = content.replace(/height="4200"/g, 'height="4080"');

// Replace the bottom y-coordinates of the earth/space paths
content = content.replace(/L 440,4200 L -20,4200/g, 'L 440,4080 L -20,4080');
content = content.replace(/L440,4200 L-20,4200/g, 'L440,4080 L-20,4080');

// Fix node position calculations
content = content.replace(/node\.y \/ 4200/g, 'node.y / 4080');

fs.writeFileSync('src/App.tsx', content);
console.log('patched');
