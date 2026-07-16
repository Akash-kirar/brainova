const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {planQuestions.map((q, idx) => {
                               if (!planAnswers[idx]) return null;
                               return (
                                <div key={q.id} className="bg-[#2a2a2c] p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors flex flex-col justify-center">
                                  <p className="text-xs text-white/50 mb-1.5 line-clamp-1">{t(q.question, language)}</p>
                                  {isEditingProfile ? (
                                    <select 
                                      value={planAnswers[idx]} 
                                      onChange={(e) => setPlanAnswers({ ...planAnswers, [idx]: e.target.value })}
                                      className="w-full bg-[#1a1a1c] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-indigo-500 text-[15px] mt-1"
                                    >
                                      {q.options.map(opt => (
                                        <option key={opt} value={opt}>{t(opt, language)}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <p className="text-[15px] font-semibold text-white/90">
                                      {t(planAnswers[idx], language)}
                                    </p>
                                  )}
                                </div>
                               )
                            })}
                          </div>
                          
                          <div onClick={() => setIsPlanGeneratorOpen(true)} className="mt-6 p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 rounded-2xl flex items-start gap-4 cursor-pointer transition-colors">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                               <Sparkles className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                               <h4 className="font-bold text-indigo-300 mb-1">AI Recommendation Active</h4>
                               
                            </div>
                          </div>`;

const replaceStr = `                          <div onClick={() => setIsPlanGeneratorOpen(true)} className="mb-6 p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 rounded-2xl flex items-center gap-4 cursor-pointer transition-colors">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                               <Sparkles className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                               <h4 className="font-bold text-indigo-300">AI Recommendation Active</h4>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {planQuestions.map((q, idx) => {
                               if (!planAnswers[idx]) return null;
                               return (
                                <div key={q.id} className="bg-[#2a2a2c] p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors flex flex-col justify-center">
                                  <p className="text-xs text-white/50 mb-1.5 line-clamp-1">{t(q.question, language)}</p>
                                  {isEditingProfile ? (
                                    <select 
                                      value={planAnswers[idx]} 
                                      onChange={(e) => setPlanAnswers({ ...planAnswers, [idx]: e.target.value })}
                                      className="w-full bg-[#1a1a1c] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-indigo-500 text-[15px] mt-1"
                                    >
                                      {q.options.map(opt => (
                                        <option key={opt} value={opt}>{t(opt, language)}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <p className="text-[15px] font-semibold text-white/90">
                                      {t(planAnswers[idx], language)}
                                    </p>
                                  )}
                                </div>
                               )
                            })}
                          </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log('patched order');
} else {
  console.log('target not found for order');
}
