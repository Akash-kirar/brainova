const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const spanRegex = /<span className="text-\[12px\] text-white\/90 font-medium tracking-wide">[\s\S]*?<\/span>/;
const spanReplacement = `<span className="text-[12px] text-white/90 font-medium tracking-wide">
                  {[
                        { code: 'en-US', name: 'English' },
                        { code: 'hi-IN', name: 'हिंदी (Hindi)' },
                        { code: 'bn-IN', name: 'বাংলা (Bengali)' },
                        { code: 'mr-IN', name: 'मराठी (Marathi)' },
                        { code: 'te-IN', name: 'తెలుగు (Telugu)' }
                  ].find(l => l.code === speechLang)?.name || 'Language'}
                </span>`;
content = content.replace(spanRegex, spanReplacement);

const listRegex = /\{\[\s*\{\s*code:\s*'en-US',\s*name:\s*'English'\s*\},[\s\S]*?\]\.map\(lang => \(/;
const listReplacement = `{[
                        { code: 'en-US', name: 'English' },
                        { code: 'hi-IN', name: 'हिंदी (Hindi)' },
                        { code: 'bn-IN', name: 'বাংলা (Bengali)' },
                        { code: 'mr-IN', name: 'मराठी (Marathi)' },
                        { code: 'te-IN', name: 'తెలుగు (Telugu)' }
                      ].map(lang => (`
content = content.replace(listRegex, listReplacement);

// Make the dropdown wider for the new languages
const dropdownWidthRegex = /w-36/;
content = content.replace(dropdownWidthRegex, "w-44");

fs.writeFileSync('src/components/AiCoachView.tsx', content);
