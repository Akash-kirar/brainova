const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldModalClass = `className="bg-[#1e2330] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"`;
const newModalClass = `className="bg-[#1e2330] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"`;

// Only replace the one in the LPI modal. 
// Let's find LPI Modal comment.
const lpiCommentIndex = content.indexOf('{/* LPI Modal */}');
if (lpiCommentIndex !== -1) {
  const nextModalClassIndex = content.indexOf(oldModalClass, lpiCommentIndex);
  if (nextModalClassIndex !== -1 && nextModalClassIndex < lpiCommentIndex + 500) {
    content = content.substring(0, nextModalClassIndex) + newModalClass + content.substring(nextModalClassIndex + oldModalClass.length);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Patched LPI modal scroll");
  } else {
    console.log("Could not find modal class string near LPI Modal");
  }
} else {
  console.log("Could not find LPI Modal");
}
