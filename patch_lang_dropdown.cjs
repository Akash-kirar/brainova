const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

// 1. Add ChevronDown, Globe to imports
if (!content.includes('ChevronDown')) {
    content = content.replace("from 'lucide-react'", ", ChevronDown, Globe } from 'lucide-react'");
}

// 2. Add state
const stateReplacement = `  const [speechLang, setSpeechLang] = useState('en-US');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);`;
content = content.replace("  const [speechLang, setSpeechLang] = useState('en-US');", stateReplacement);

// 3. Update the select with a custom dropdown
const selectRegex = /<div className="flex items-center bg-black\/40 px-2 py-1 rounded-full border border-white\/10 shrink-0">[\s\S]*?<\/div>/;

const newDropdown = `<div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#161619] px-3 py-1.5 rounded-full border border-white/10 shrink-0 hover:bg-[#1e1e24] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[12px] text-white/90 font-medium tracking-wide">
                  {speechLang === 'en-US' ? 'English' : 
                   speechLang === 'es-ES' ? 'Español' : 
                   speechLang === 'fr-FR' ? 'Français' : 
                   speechLang === 'de-DE' ? 'Deutsch' : 
                   speechLang === 'it-IT' ? 'Italiano' : 
                   speechLang === 'hi-IN' ? 'हिन्दी' : 
                   speechLang === 'ja-JP' ? '日本語' : 
                   speechLang === 'zh-CN' ? '中文' : 'Language'}
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
                      className="absolute right-0 top-full mt-2 w-36 bg-[#1a1a1c] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      {[
                        { code: 'en-US', name: 'English' },
                        { code: 'es-ES', name: 'Español' },
                        { code: 'fr-FR', name: 'Français' },
                        { code: 'de-DE', name: 'Deutsch' },
                        { code: 'it-IT', name: 'Italiano' },
                        { code: 'hi-IN', name: 'हिन्दी' },
                        { code: 'ja-JP', name: '日本語' },
                        { code: 'zh-CN', name: '中文' }
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

content = content.replace(selectRegex, newDropdown);

fs.writeFileSync('src/components/AiCoachView.tsx', content);
