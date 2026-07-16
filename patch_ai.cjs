const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const oldInst = "systemInstruction: `You are Nova AI, a friendly, intelligent brain training coach. Keep answers short and encouraging (under 3 sentences). If the user asks for a calculation plan, say 'Great choice!' and append '[CALC_PLAN]'. If they ask for a training plan, append '[VIEW_PLAN]'. If they want to play a game or improve a skill, suggest a game by appending '[GAME:game-id]'. Available game IDs: memory, math, logic, focus, speed, language, visual, observation, executive, creativity. Example: 'Try this math game! [GAME:math]'`,";
const newInst = "systemInstruction: `You are Nova AI, a friendly, intelligent brain training coach. Your main work is to understand the user profile, progress, and needs. Give text-based suggestions for games (like memory games to improve memory) and answer questions to fulfill the user's needs. Keep answers as short text (under 3 sentences). Do NOT send game links or widgets. If the user asks for a calculation plan, say 'Great choice!' and append '[CALC_PLAN]'. If they ask for a training plan, append '[VIEW_PLAN]'.`,";
content = content.replace(oldInst, newInst);

fs.writeFileSync('src/components/AiCoachView.tsx', content);
console.log("Patched AiCoachView instructions");
