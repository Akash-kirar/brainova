const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\s*{\/\*\s*Notifications Modal\s*\*\/}\s*<AnimatePresence>[\s\S]*?(?={\/\*\s*Game Overlay\s*\*\/}|{\/\*\s*Premium Subscription Modal\s*\*\/})/;

if (regex.test(content)) {
  content = content.replace(regex, '\n          ');
  fs.writeFileSync('src/App.tsx', content);
  console.log("Modal removed successfully!");
} else {
  console.log("Modal not found using regex!");
}
