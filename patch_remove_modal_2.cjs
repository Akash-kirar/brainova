const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\s*{\/\*\s*Notifications Modal\s*\*\/}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/;

if (regex.test(content)) {
  content = content.replace(regex, '');
  fs.writeFileSync('src/App.tsx', content);
  console.log("Modal removed successfully! (using updated regex)");
} else {
  console.log("Modal not found using updated regex!");
}
