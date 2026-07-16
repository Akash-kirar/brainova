const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeader = `<div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Personalized Training Profile</h3>
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
                      </div>`;

const newHeader = `<div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Personalized Training Profile</h3>
                        <button 
                          onClick={() => {
                            setIsEditingProfile(!isEditingProfile);
                          }}
                          className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                          <Edit2 className="w-4 h-4" /> {isEditingProfile ? "Save Changes" : "Edit Info"}
                        </button>
                      </div>`;

const oldGrid = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          </div>`;

const newGrid = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

content = content.replace(oldHeader, newHeader);
content = content.replace(oldGrid, newGrid);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched profile edit view");
