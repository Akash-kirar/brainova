const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const regex = /<button \n\s*onClick=\{toggleRecording\}\n\s*className=\{\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors \$\{isRecording \? 'text-red-500 animate-pulse bg-red-500\/10' : 'text-white\/40 hover:text-white'\}\`\}\n\s*>\n\s*<Mic className="w-5 h-5" \/>\n\s*<\/button>/;
content = content.replace(regex, "");

const micRegex2 = /<button className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white\/40 hover:text-white transition-colors">\s*<Mic className="w-5 h-5" \/>\s*<\/button>/;
content = content.replace(micRegex2, "");

// Replace the Mic import
content = content.replace(", Mic,", ",");

fs.writeFileSync('src/components/AiCoachView.tsx', content);
