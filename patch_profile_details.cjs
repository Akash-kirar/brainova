const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="bg-\[#1a1a1c\] border border-white\/10 rounded-2xl p-6 relative">\s*<div className="flex justify-between items-center mb-4 border-b border-white\/10 pb-2">\s*<h3 className="text-lg font-bold text-blue-400">Profile Details<\/h3>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

// Looking closely at sed output:
/*
                    <div className="bg-[#1a1a1c] border border-white/10 rounded-2xl p-6 relative">
                      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                        <h3 className="text-lg font-bold text-blue-400">Profile Details</h3>
                        <button 
                          onClick={() => {
                            setTempName(profileName);
                            setTempEmail(profileEmail);
                            setIsEditNameOpen(true);
                            setIsMyInfoOpen(false);
                          }}
                          className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-white/50 mb-1">Name</p>
                          <p className="text-lg font-medium">{profileName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/50 mb-1">Email</p>
                          <p className="text-lg font-medium">{profileEmail || 'Not Provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/50 mb-1">XP</p>
                          <p className="text-lg font-medium text-[#bde85b]">{totalXP}</p>
                        </div>
                      </div>
                    </div>
*/
content = content.replace(regex, '');
fs.writeFileSync('src/App.tsx', content);
