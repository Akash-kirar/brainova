const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

// I need to properly reconstruct the dropdown because I broke it in my previous patch

const dropdownRegex = /<div className="relative">\s*<button[\s\S]*?<\/AnimatePresence>\s*<\/div>/;

const correctDropdown = `<div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#161619] px-3 py-1.5 rounded-full border border-white/10 shrink-0 hover:bg-[#1e1e24] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[12px] text-white/90 font-medium tracking-wide">
                  {[
                        { code: 'en-US', name: 'English' },
                        { code: 'hi-IN', name: 'हिंदी (Hindi)' },
                        { code: 'bn-IN', name: 'বাংলা (Bengali)' },
                        { code: 'mr-IN', name: 'मराठी (Marathi)' },
                        { code: 'te-IN', name: 'తెలుగు (Telugu)' }
                  ].find(l => l.code === speechLang)?.name || 'Language'}
                </span>
                <ChevronDown className={\`w-3.5 h-3.5 text-white/50 transition-transform duration-200 \${isLangDropdownOpen ? 'rotate-180' : ''}\`} />
              </button>

              <AnimatePresence>
                {isLangDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLangDropdownOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-[#1a1a1c] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      {[
                        { code: 'en-US', name: 'English' },
                        { code: 'hi-IN', name: 'हिंदी (Hindi)' },
                        { code: 'bn-IN', name: 'বাংলা (Bengali)' },
                        { code: 'mr-IN', name: 'मराठी (Marathi)' },
                        { code: 'te-IN', name: 'తెలుగు (Telugu)' }
                      ].map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSpeechLang(lang.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={\`w-full text-left px-4 py-2.5 text-sm transition-colors \${speechLang === lang.code ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}\`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>`;

content = content.replace(dropdownRegex, correctDropdown);

fs.writeFileSync('src/components/AiCoachView.tsx', content);
