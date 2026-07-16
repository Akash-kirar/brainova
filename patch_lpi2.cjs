const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the drop-shadow in the modal header
content = content.replace(
  `drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]`,
  `drop-shadow-[0_0_8px_rgba(192,132,252,0.3)]`
);

// We should replace all occurrences in the LPI modal
content = content.replace(/bg-\[#fbbf24\] rounded-sm shadow-\[0_0_12px_rgba\(251,191,36,0\.4\)\]/g, 'bg-[#c084fc] rounded-sm shadow-[0_0_12px_rgba(192,132,252,0.4)]');
content = content.replace(/bg-\[#fbbf24\] rounded-sm shadow-\[0_0_12px_rgba\(251,191,36,0\.3\)\]/g, 'bg-[#c084fc] rounded-sm shadow-[0_0_12px_rgba(192,132,252,0.3)]');

fs.writeFileSync('src/App.tsx', content);
console.log("Patched LpiModal properly");
