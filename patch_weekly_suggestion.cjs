const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = `                  <h3 className="text-[16px] text-white font-medium tracking-wide mb-4">Score Trend</h3>`;

const insertion = `                {/* Weekly Suggestion */}
                <div className="px-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] text-white font-medium tracking-wide">Weekly Suggestion</h3>
                    <div className="bg-[#a855f7]/20 text-[#c084fc] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">AI Generated</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1a1c] to-[#121213] rounded-3xl p-5 border border-white/5 relative overflow-hidden">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#a855f7]/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-[#c084fc]" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Nova's Advice</h4>
                        <p className="text-sm text-white/60 leading-relaxed mb-4">Your visual scores are great, but logic is lagging slightly. I suggest focusing on problem-solving this week to balance your profile.</p>
                        <button 
                          onClick={() => setCurrentTab('coach')}
                          className="text-sm font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] px-5 py-2.5 rounded-full transition-colors inline-flex items-center gap-2 shadow-[0_0_15px_rgba(109,40,217,0.3)]"
                        >
                          <Brain className="w-4 h-4" /> Get a Training Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Brain Score Trend */}
                <div className="px-6 mb-8">
                  <h3 className="text-[16px] text-white font-medium tracking-wide mb-4">Score Trend</h3>`;

content = content.replace(`                {/* Brain Score Trend */}
                <div className="px-6 mb-8">
` + anchor, insertion);

fs.writeFileSync('src/App.tsx', content);
