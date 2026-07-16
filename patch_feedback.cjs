const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const oldButton = `                    <button 
                      onClick={() => {
                        setIsProfileSettingsOpen(false);
                        setIsFeedbackOpen(true);
                      }}
                      className="w-full flex items-center gap-4 text-left px-4 py-4 text-base text-white hover:bg-white/5 transition-colors rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white/70" />
                      </div>
                      <span className="font-medium">{t('yourFeedback', language)}</span>
                    </button>`;

const newButton = `                    <button 
                      onClick={() => {
                        setIsProfileSettingsOpen(false);
                        setIsFeedbackOpen(true);
                      }}
                      className="relative w-full flex items-center justify-between p-1 mt-4 mb-2 text-left transition-all rounded-2xl group overflow-hidden"
                      style={{
                        background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-4 relative z-10 p-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                          <MessageSquare className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <div>
                          <span className="block font-bold text-white text-[16px]">{t('yourFeedback', language) || "Your Feedback"}</span>
                          <span className="block text-[13px] text-purple-300">We'd love to hear from you!</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/50 mr-4 relative z-10" />
                    </button>`;

appContent = appContent.replace(oldButton, newButton);

fs.writeFileSync('src/App.tsx', appContent);
