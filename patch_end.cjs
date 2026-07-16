const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const endRegex = /<\/div>\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>\s*\{celebrationData && \(/;
if (endRegex.test(content)) {
  content = content.replace(endRegex, '</div>\n        {celebrationData && (');
  console.log("Fixed end of file!");
  fs.writeFileSync('src/App.tsx', content);
} else {
  console.log("Could not find end regex.");
}
