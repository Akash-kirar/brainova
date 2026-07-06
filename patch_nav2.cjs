const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<button \n              onClick={() => setCurrentTab('coach')}\n              className={\`flex flex-col items-center justify-center transition-colors relative \${currentTab === 'coach' ? 'text-white' : 'text-white/40 hover:text-white'}\`}\n            >\n              <div className={\`flex flex-col items-center gap-1 \${currentTab === 'coach' ? '-mt-4' : ''}\`}>\n                {currentTab === 'coach' ? (\n                  <div className="bg-[#6d28d9] w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(109,40,217,0.6)]">\n                    <Bot className="w-6 h-6 text-white" />\n                  </div>\n                ) : (\n                  <Bot className="w-6 h-6" />\n                )}\n                <span className={\`text-[10px] font-medium \${currentTab === 'coach' ? 'text-[#d8b4fe]' : ''}\`}>AI Coach</span>\n              </div>\n            </button>`;

const replacement = `<button 
              onClick={() => setCurrentTab('coach')}
              className={\`flex flex-col items-center gap-1 transition-colors \${currentTab === 'coach' ? 'text-white' : 'text-white/40 hover:text-white'}\`}
            >
              <Bot className="w-6 h-6" />
              <span className="text-[10px] font-medium">AI Coach</span>
            </button>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Replaced successfully');
} else {
  console.log('Target not found');
}
