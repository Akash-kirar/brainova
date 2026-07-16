const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldMapNodesLogic = `  const mapNodes = mapNodesBase.map((node, index) => {
    const requiredXP = parseInt(node.xp) || 0;
    const nextNode = mapNodesBase[index - 1]; // Array is sorted descending
    const nextRequiredXP = nextNode ? parseInt(nextNode.xp) || 0 : Infinity;
    
    let status = 'locked';
    let progress = 0;
    
    const isFirstNode = index === mapNodesBase.length - 1;

    if (totalXP >= nextRequiredXP) {
      status = 'completed';
    } else if (totalXP >= requiredXP && totalXP < nextRequiredXP) {
      if (isFirstNode && totalXP < 100) {
        status = 'locked';
        progress = (totalXP / 100) * 100;
      } else {
        status = 'current';
        progress = ((totalXP - requiredXP) / (nextRequiredXP - requiredXP)) * 100;
      }
    } else {
      status = 'locked';
    }

    if (index === 0 && totalXP >= requiredXP) {
       status = 'current';
       progress = 100;
    }`;

const newMapNodesLogic = `  const mapNodes = mapNodesBase.map((node, index) => {
    const requiredXP = parseInt(node.xp) || 0;
    const nextNode = mapNodesBase[index - 1]; // Array is sorted descending
    const nextRequiredXP = nextNode ? parseInt(nextNode.xp) || 0 : Infinity;
    
    let status = 'locked';
    let progress = 0;
    
    if (totalXP >= nextRequiredXP) {
      status = 'completed';
    } else if (totalXP >= requiredXP && totalXP < nextRequiredXP) {
      status = 'current';
      progress = ((totalXP - requiredXP) / (nextRequiredXP - requiredXP)) * 100;
    } else {
      status = 'locked';
    }

    if (index === 0 && totalXP >= requiredXP) {
       status = 'current';
       progress = 100;
    }`;

if (content.includes(oldMapNodesLogic)) {
    content = content.replace(oldMapNodesLogic, newMapNodesLogic);
}

const oldLabelLogic = `{isCurrent || (isLocked && node.id === 1 && totalXP < 100) ? (node.id === 1 && totalXP < 100 ? \`\${totalXP} / 100 XP\` : \`\${totalXP - (parseInt(node.xp) || 0)} / \${parseInt(node.maxXP || node.xp) - (parseInt(node.xp) || 0)} XP\`) : node.status === 'completed' ? '' : \`\${node.xp} XP\`}`;
const newLabelLogic = `{isCurrent ? (totalXP === 0 && node.id === 1 ? '0 / 100 XP' : \`\${totalXP - (parseInt(node.xp) || 0)} / \${parseInt(node.maxXP || node.xp) - (parseInt(node.xp) || 0)} XP\`) : node.status === 'completed' ? '' : \`\${node.xp} XP\`}`;

if (content.includes(oldLabelLogic)) {
    content = content.replace(oldLabelLogic, newLabelLogic);
}

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx map reverted.');
