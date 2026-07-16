const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetRegex = /<\/AnimatePresence>\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*\{currentTab === 'profile'/;

if (targetRegex.test(content)) {
  const replaceStr = `                  </AnimatePresence>
                </div>

                {/* Achievements Button on Progress Tab */}
                <div className="px-6 mb-6">
                  <button 
                    onClick={() => setIsAchievementsOpen(true)}
                    className="w-full flex items-center justify-between p-5 rounded-[24px] bg-[#121217] border border-white/5 hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center">
                        <Award className="w-7 h-7 text-[#f59e0b]" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-white text-[16px] tracking-wide mb-1">Your Achievements</h3>
                        <div className="flex items-center gap-1.5 text-[14px]">
                          <span className="text-[#a855f7] font-bold">{unlockedAchievementsCount} / 24</span>
                          <span className="text-white/50 font-medium">unlocked</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" />
                  </button>
                </div>
              </motion.div>
            )}
            {currentTab === 'profile'`;
  
  content = content.replace(targetRegex, replaceStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log('patched progress tab for achievements');
} else {
  console.log('target not found for progress tab');
}
