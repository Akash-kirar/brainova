const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

if (!content.includes('User,')) {
  content = content.replace('ChevronLeft, Bot,', 'User, ChevronLeft, Bot,');
  fs.writeFileSync('src/components/AiCoachView.tsx', content);
  console.log('Fixed import');
}
