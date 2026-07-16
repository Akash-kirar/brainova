const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetBtn = `                  <button 
                    onClick={() => setIsBenefitsModalOpen(true)}
                    className="w-full flex items-center gap-4 text-left px-4 py-4 text-base text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="font-medium">Our Benefits</span>
                  </button>`;

content = content.replace(targetBtn, '');

const targetModalRegex = /\s*\{\/\* Our Benefits Modal \*\/\}\s*<AnimatePresence>\s*\{isBenefitsModalOpen && \([\s\S]*?<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/g;

content = content.replace(targetModalRegex, '');

fs.writeFileSync('src/App.tsx', content);
console.log('patched');
