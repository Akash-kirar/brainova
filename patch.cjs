const fs = require('fs');
let file = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

// 1. Add prop to interface
file = file.replace(
  /interface AiCoachViewProps \{/,
  'interface AiCoachViewProps {\n  onOpenProfile?: () => void;'
);

// 2. Destructure prop
file = file.replace(
  /export default function AiCoachView\(\{ onPlayGame, profileName, onSend \} : AiCoachViewProps\) \{/,
  'export default function AiCoachView({ onPlayGame, profileName, onSend, onOpenProfile } : AiCoachViewProps) {'
);

// 3. Attach onClick to the Sparkles button
file = file.replace(
  /<button className="w-10 h-10 rounded-full bg-\[#2e1065\] text-\[#d8b4fe\] flex items-center justify-center shrink-0 hover:bg-\[#3b0764\] transition-colors shadow-inner">/,
  '<button onClick={() => onOpenProfile && onOpenProfile()} className="w-10 h-10 rounded-full bg-[#2e1065] text-[#d8b4fe] flex items-center justify-center shrink-0 hover:bg-[#3b0764] transition-colors shadow-inner">'
);

fs.writeFileSync('src/components/AiCoachView.tsx', file);
console.log("AiCoachView patched");
