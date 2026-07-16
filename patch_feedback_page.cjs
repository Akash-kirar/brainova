const fs = require('fs');

let fb = fs.readFileSync('src/components/FeedbackPage.tsx', 'utf8');
fb = fb.replace('<p className="text-white/60 text-base">Let us know how we can improve Brainova.</p>', '');
fs.writeFileSync('src/components/FeedbackPage.tsx', fb);
