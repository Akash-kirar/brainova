const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "if (isFirstNode && totalXP < 100) {\\n        status = 'locked';\\n        progress = (totalXP / 100) * 100;\\n      } else {",
  "if (isFirstNode && totalXP < 50) {\\n        status = 'locked';\\n        progress = (totalXP / 50) * 100;\\n      } else {"
);

const oldLabelLogic = "{isCurrent || (isLocked && node.id === 1 && totalXP < 100) ? (node.id === 1 && totalXP < 100 ? \`\${totalXP} / 100 XP\` : \`\${totalXP - (parseInt(node.xp) || 0)} / \${parseInt(node.maxXP || node.xp) - (parseInt(node.xp) || 0)} XP\`) : node.status === 'completed' ? '' : \`\${node.xp} XP\`}";
const newLabelLogic = "{isCurrent || (isLocked && node.id === 1 && totalXP < 50) ? (node.id === 1 && totalXP < 50 ? \`\${totalXP} / 50 XP\` : \`\${totalXP - (parseInt(node.xp) || 0)} / \${parseInt(node.maxXP || node.xp) - (parseInt(node.xp) || 0)} XP\`) : node.status === 'completed' ? '' : \`\${node.xp} XP\`}";

if (content.includes(oldLabelLogic)) {
    content = content.replace(oldLabelLogic, newLabelLogic);
    console.log("Label logic patched");
} else {
    console.log("Could not find label logic");
}

fs.writeFileSync('src/App.tsx', content);
