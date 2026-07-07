const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const regex = /<div className="flex items-center">\s*<select\s*value=\{speechLang\}\s*onChange=\{\(e\) => setSpeechLang\(e\.target\.value\)\}\s*className="bg-\[#1e1e24\] text-white\/80 text-xs border border-white\/10 rounded-lg px-2 py-1\.5 outline-none cursor-pointer hover:border-white\/30 transition-colors mr-2"\s*>\s*<option value="en-US">English<\/option>\s*<option value="es-ES">Español<\/option>\s*<option value="fr-FR">Français<\/option>\s*<option value="de-DE">Deutsch<\/option>\s*<option value="it-IT">Italiano<\/option>\s*<option value="hi-IN">हिन्दी<\/option>\s*<option value="ja-JP">日本語<\/option>\s*<option value="zh-CN">中文<\/option>\s*<\/select>\s*<\/div>/;

content = content.replace(regex, '');
fs.writeFileSync('src/components/AiCoachView.tsx', content);
