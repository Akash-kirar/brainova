const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = app.indexOf('{/* Feedback Modal */}');
if (startIndex !== -1) {
  const endIndex = app.indexOf('</AnimatePresence>', startIndex) + '</AnimatePresence>'.length;
  if (endIndex > startIndex) {
    app = app.slice(0, startIndex) + app.slice(endIndex);
    fs.writeFileSync('src/App.tsx', app);
    console.log('Removed modal');
  }
}
