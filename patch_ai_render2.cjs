const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const badRender = `{gameIds.length > 0 && !isUser && (
                      <div className="mt-3 flex flex-col gap-2">
                        {gameIds.map(gameId => (
                          <button 
                            key={gameId}
                            onClick={() => onPlayGame(gameId)}
                            className="flex items-center gap-3 bg-[#1e1e24] hover:bg-[#2a2a32] transition-colors border border-white/10 rounded-2xl p-3 text-left w-full max-w-[280px]"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[#a855f7]/20 flex items-center justify-center shrink-0">
                              <Gamepad2 className="w-5 h-5 text-[#c084fc]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white text-sm font-bold truncate">Play {gameId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                              <p className="text-white/50 text-[11px] truncate">Tap to start</p>
                            </div>
                            <Play className="w-4 h-4 text-white/40" />
                          </button>
                        ))}
                      </div>
                    )}`;

content = content.replace(badRender, '');

fs.writeFileSync('src/components/AiCoachView.tsx', content);
console.log("Patched AiCoachView render2");
