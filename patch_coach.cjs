const fs = require('fs');
let file = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

file = file.replace(
  /export default function AiCoachView\(\{ profileName, onSend, onPlayGame \}: AiCoachViewProps\) \{/,
  'export default function AiCoachView({ profileName, onSend, onPlayGame, onOpenProfile }: AiCoachViewProps) {'
);

fs.writeFileSync('src/components/AiCoachView.tsx', file);
console.log("AiCoachView patched again");
