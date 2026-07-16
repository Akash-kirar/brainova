const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<h2 className="text-2xl font-bold text-white">Current Nova Coin</h2>');
if (startIndex !== -1) {
  // We'll replace the chunk from 500 characters before to 2000 characters after
  let chunkStart = startIndex - 500;
  let chunkEnd = startIndex + 3000;
  let chunk = content.substring(chunkStart, chunkEnd);
  
  // Replace drop-shadow
  chunk = chunk.replace(/drop-shadow-\[0_0_8px_rgba\(251,191,36,0\.3\)\]/g, 'drop-shadow-[0_0_8px_rgba(192,132,252,0.3)]');
  // Replace filter
  chunk = chunk.replace(/invert\(75\%\) sepia\(85\%\) saturate\(718\%\) hue-rotate\(352deg\) brightness\(101\%\) contrast\(106\%\)/g, 'invert(64%) sepia(51%) saturate(2371%) hue-rotate(227deg) brightness(101%) contrast(97%)');
  // Replace text color
  chunk = chunk.replace(/text-\[#fbbf24\]/g, 'text-[#c084fc]');
  // Replace bg color
  chunk = chunk.replace(/bg-\[#fbbf24\]/g, 'bg-[#c084fc]');
  // Replace shadows
  chunk = chunk.replace(/shadow-\[0_0_12px_rgba\(251,191,36,0\.4\)\]/g, 'shadow-[0_0_12px_rgba(192,132,252,0.4)]');
  chunk = chunk.replace(/shadow-\[0_0_12px_rgba\(251,191,36,0\.3\)\]/g, 'shadow-[0_0_12px_rgba(192,132,252,0.3)]');
  
  content = content.substring(0, chunkStart) + chunk + content.substring(chunkEnd);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched LpiModal");
} else {
  console.log("Could not find LpiModal");
}
