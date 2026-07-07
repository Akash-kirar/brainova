const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

// Update Props
content = content.replace(
  'interface AiCoachViewProps {',
  `interface AiCoachViewProps {
  onPlayGame: (gameId: string) => void;`
);

// Update component signature
content = content.replace(
  'export default function AiCoachView({ profileName, onSend }: AiCoachViewProps) {',
  'export default function AiCoachView({ profileName, onSend, onPlayGame }: AiCoachViewProps) {'
);

// Update system instruction
content = content.replace(
  /systemInstruction: `You are Nova AI.*?`,/,
  "systemInstruction: `You are Nova AI, a friendly, intelligent brain training coach. Keep answers short and encouraging (under 3 sentences). If the user asks for a calculation plan, say 'Great choice!' and append '[CALC_PLAN]'. If they ask for a training plan, append '[VIEW_PLAN]'. If they want to play a game or improve a skill, suggest a game by appending '[GAME:game-id]'. Available game IDs: memory, math, logic, focus, speed, language, visual, observation, executive, creativity. Example: 'Try this math game! [GAME:math]'`,"
);

fs.writeFileSync('src/components/AiCoachView.tsx', content);
