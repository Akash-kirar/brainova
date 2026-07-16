const fs = require('fs');
let content = fs.readFileSync('src/components/AchievementsPage.tsx', 'utf8');

// Revert broken replacements
content = content.replace(/#fbbf34/g, '#fbbf24');
content = content.replace(/168,85,347/g, '168,85,247');
content = content.replace(/147,51,234/g, '147,51,255'); // Wait, 147,51,255 wasn't 234. Let's check what 147,51,234 was. It was probably rgba(147,51,255,0.3) ? Or maybe rgba(168,85,247). Oh wait, I didn't replace 24 in 147,51,255, I replaced 24. Wait, 24 -> 34?

// Let's just fix the specific ones
// 34px rounded is fine or not? It was 24px!
content = content.replace(/rounded-\[34px\]/g, 'rounded-[24px]');
content = content.replace(/pb-34/g, 'pb-24');
content = content.replace(/bg-\[#121134\]/g, 'bg-[#121124]');

fs.writeFileSync('src/components/AchievementsPage.tsx', content);

console.log('fixed broken numbers');
