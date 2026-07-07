const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<button \n\s*onClick=\{\(\) => \{\n\s*setIsProfileSettingsOpen\(false\);\n\s*setIsAdminPanelOpen\(true\);\n\s*\}\}\n\s*className="w-full flex items-center gap-4 text-left px-4 py-4 text-base text-emerald-400 hover:bg-white\/5 transition-colors rounded-xl"\n\s*>\n\s*<div className="w-10 h-10 rounded-full bg-white\/5 flex items-center justify-center">\n\s*<Lock className="w-5 h-5 text-emerald-400" \/>\n\s*<\/div>\n\s*<span className="font-medium text-emerald-400">\{t\('adminPanel', language\)\}<\/span>\n\s*<\/button>/;

content = content.replace(regex, "");

fs.writeFileSync('src/App.tsx', content);
