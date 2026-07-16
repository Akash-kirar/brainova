const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<h3 className="text-lg font-bold text-indigo-400">Training Information<\/h3>[\s\S]*?<\/div>\n                    <\/div>/;

const newHTML = `<h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Personalized Training Profile</h3>
                        <button 
                          onClick={() => {
                            setPlanStep(0);
                            setIsPlanGeneratorOpen(true);
                            setIsMyInfoOpen(false);
                          }}
                          className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                          <Edit2 className="w-4 h-4" /> Retake Test
                        </button>
                      </div>
                      
                      {Object.keys(planAnswers).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center bg-white/5 rounded-xl border border-white/10">
                          <Brain className="w-12 h-12 text-indigo-400 mb-4 opacity-50" />
                          <h4 className="text-lg font-bold text-white mb-2">No Training Profile Found</h4>
                          <p className="text-white/60 mb-6 max-w-sm mx-auto">Take our 10-question assessment so Brainova AI can design a personalized cognitive training program just for you.</p>
                          <button 
                            onClick={() => {
                              setPlanStep(0);
                              setIsPlanGeneratorOpen(true);
                              setIsMyInfoOpen(false);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2"
                          >
                            <Bot className="w-5 h-5" /> Start AI Assessment
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {planQuestions.map((q, idx) => {
                               if (!planAnswers[idx]) return null;
                               return (
                                <div key={q.id} className="bg-[#2a2a2c] p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                                  <p className="text-xs text-white/50 mb-1.5 line-clamp-1">{t(q.question, language)}</p>
                                  <p className="text-[15px] font-semibold text-white/90">
                                    {t(planAnswers[idx], language)}
                                  </p>
                                </div>
                               )
                            })}
                          </div>
                          
                          <div className="mt-6 p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                               <Sparkles className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                               <h4 className="font-bold text-indigo-300 mb-1">AI Recommendation Active</h4>
                               <p className="text-sm text-white/70 leading-relaxed">Your daily training routine is customized based on these 10 data points. We will focus on improving your specific cognitive goals and adapting to your stress and sleep levels.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>`;

content = content.replace(regex, newHTML);
fs.writeFileSync('src/App.tsx', content);
