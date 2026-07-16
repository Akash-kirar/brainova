const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `              </motion.div>
            )}

            {currentTab === 'games' && (`;

const feedbackCard = `                {/* Feedback Card */}
                <div className="px-6 mb-24 mt-8">
                  <button 
                    onClick={() => setIsFeedbackOpen(true)}
                    className="relative w-full flex items-center justify-between p-5 text-left transition-all rounded-3xl group overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      boxShadow: '0 10px 30px -10px rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/30 rotate-3 group-hover:rotate-0 transition-transform">
                        <MessageSquare className="w-7 h-7 text-white animate-pulse" />
                      </div>
                      <div>
                        <span className="block font-black text-white text-[18px] tracking-tight mb-0.5">{t('yourFeedback', language) || "Your Feedback"}</span>
                        <span className="block text-[14px] text-pink-200 font-medium">We'd love to hear from you!</span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-pink-300 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentTab === 'games' && (`;

if (app.includes(targetStr)) {
  app = app.replace(targetStr, feedbackCard);
  fs.writeFileSync('src/App.tsx', app);
  console.log('Successfully patched Feedback card');
} else {
  console.log('Target string not found');
}
