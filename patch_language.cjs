const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

// 1. Remove the select from the bottom
const selectRegex = /<select[\s\S]*?<\/select>/;
content = content.replace(selectRegex, '');

// 2. Add select to the top header
const headerRegex = /<h2 className="text-white font-bold text-\[17px\] leading-tight flex items-center gap-1">NOVA AI <Sparkles className="w-3\.5 h-3\.5 text-\[#a855f7\]" \/><\/h2>\s*<p className="text-\[#8a8a93\] text-\[13px\]">Your Personal Brain Coach<\/p>\s*<\/div>\s*<\/div>\s*<\/div>/;

const headerReplacement = `<h2 className="text-white font-bold text-[17px] leading-tight flex items-center gap-1">NOVA AI <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" /></h2>
                  <p className="text-[#8a8a93] text-[13px]">Your Personal Brain Coach</p>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <select 
                value={speechLang}
                onChange={(e) => setSpeechLang(e.target.value)}
                className="bg-[#1e1e24] text-white/80 text-xs border border-white/10 rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-white/30 transition-colors mr-2"
              >
                <option value="en-US">English</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
                <option value="de-DE">Deutsch</option>
                <option value="it-IT">Italiano</option>
                <option value="hi-IN">हिन्दी</option>
                <option value="ja-JP">日本語</option>
                <option value="zh-CN">中文</option>
              </select>
            </div>`;

content = content.replace(headerRegex, headerReplacement);

// 3. Update handleSend
const handleSendRegex = /let streamResponse = await chatRef\.current\.sendMessageStream\({ message: textToSend }\);/;
const handleSendReplacement = `const languageInstruction = \`\\n\\n[System Instruction: The user's preferred language code is '\${speechLang}'. Please respond to this message in that language.]\`;
        let streamResponse = await chatRef.current.sendMessageStream({ message: textToSend + languageInstruction });`;

content = content.replace(handleSendRegex, handleSendReplacement);

fs.writeFileSync('src/components/AiCoachView.tsx', content);
