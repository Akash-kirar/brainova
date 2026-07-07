const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const regex = /<div className="flex items-center gap-1\.5 bg-black\/40 px-2 py-1 rounded-full border border-white\/10 shrink-0">\s*<div className="w-2 h-2 rounded-full bg-\[#10b981\] shadow-\[0_0_8px_#10b981\]"><\/div>\s*<span className="text-\[11px\] text-white\/90 font-medium tracking-wide">Online<\/span>\s*<\/div>/;

const replacement = `<div className="flex items-center bg-black/40 px-2 py-1 rounded-full border border-white/10 shrink-0">
              <select 
                value={speechLang}
                onChange={(e) => setSpeechLang(e.target.value)}
                className="bg-transparent text-[11px] text-white/90 font-medium tracking-wide border-none outline-none cursor-pointer hover:text-white transition-colors"
              >
                <option value="en-US">EN</option>
                <option value="es-ES">ES</option>
                <option value="fr-FR">FR</option>
                <option value="de-DE">DE</option>
                <option value="it-IT">IT</option>
                <option value="hi-IN">HI</option>
                <option value="ja-JP">JA</option>
                <option value="zh-CN">ZH</option>
              </select>
            </div>`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/AiCoachView.tsx', content);
