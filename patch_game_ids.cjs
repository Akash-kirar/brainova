const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const regex = /const hasCalcPlan = message\.text\.includes\('\[CALC_PLAN\]'\);\s*const hasPlan = message\.text\.includes\('\[VIEW_PLAN\]'\);\s*const displayText = message\.text\.replace\('\[CALC_PLAN\]', ''\)\.replace\('\[VIEW_PLAN\]', ''\);/;

const replacement = `const hasCalcPlan = message.text.includes('[CALC_PLAN]');
              const hasPlan = message.text.includes('[VIEW_PLAN]');
              const gameRegex = /\\[GAME:([^\\]]+)\\]/g;
              const gameIds = [];
              let match;
              while ((match = gameRegex.exec(message.text)) !== null) {
                gameIds.push(match[1]);
              }
              const displayText = message.text.replace(gameRegex, '').replace('[CALC_PLAN]', '').replace('[VIEW_PLAN]', '').trim();`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/AiCoachView.tsx', content);
