const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                            {generatedPlan.games.map(game => (
                              <button 
                                key={game.id}
                                onClick={() => {
                                  setIsPlanGeneratorOpen(false);
                                  setActiveGameDetails(game.id);
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#2a2a2c] hover:bg-[#3a3a3c] transition-colors text-left"
                              >
                                <div className={\`w-14 h-14 rounded-xl \${game.color} flex items-center justify-center shrink-0\`}>
                                  {game.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-lg">{game.title}</h4>
                                  <p className="text-sm text-white/50">{game.category}</p>
                                </div>
                                <Play className="w-6 h-6 text-white/30" />
                              </button>
                            ))}
                          </div>`;

const replacementStr = `                            {generatedPlan.games.map(game => (
                              <button 
                                key={game.id}
                                onClick={() => {
                                  setIsPlanGeneratorOpen(false);
                                  handlePlayGame(game.id);
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#2a2a2c] hover:bg-[#3a3a3c] transition-colors text-left relative"
                              >
                                <div className={\`w-14 h-14 rounded-xl \${game.color} flex items-center justify-center shrink-0\`}>
                                  {game.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-lg">{game.title}</h4>
                                  <p className="text-sm text-white/50">{game.category}</p>
                                </div>
                                {(game as any).isPremium && (
                                  <Crown className="w-5 h-5 text-[#f59e0b] mr-2" />
                                )}
                                <Play className="w-6 h-6 text-white/30" />
                              </button>
                            ))}
                          </div>`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', content);
console.log('patched custom routine');
