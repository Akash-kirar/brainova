const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                            onClick={() => {
                              setActiveGameDetails(game.id);
                              setIsStarredGamesOpen(false);
                            }}
                            className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 hover:bg-[#2a2a2c] transition-colors cursor-pointer group relative"
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLikedGame(game.id);
                              }}
                              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
                            >
                              <Star className={\`w-4 h-4 \${likedGames.includes(game.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'}\`} />
                            </button>
                            <div className={\`w-12 h-12 rounded-xl \${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform\`}>
                              {game.icon}
                            </div>
                            <h4 className="font-bold mb-1 truncate">{game.title}</h4>
                            <p className="text-xs text-white/60 truncate">{game.category}</p>
                          </div>`;

const replacementStr = `                            onClick={() => {
                              setIsStarredGamesOpen(false);
                              handlePlayGame(game.id);
                            }}
                            className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 hover:bg-[#2a2a2c] transition-colors cursor-pointer group relative"
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLikedGame(game.id);
                              }}
                              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
                            >
                              <Star className={\`w-4 h-4 \${likedGames.includes(game.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'}\`} />
                            </button>
                            {(game as any).isPremium && (
                              <div className="absolute bottom-4 right-4 z-20 opacity-60">
                                <Crown className="w-5 h-5 text-[#f59e0b]" />
                              </div>
                            )}
                            <div className={\`w-12 h-12 rounded-xl \${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform\`}>
                              {game.icon}
                            </div>
                            <h4 className="font-bold mb-1 truncate">{game.title}</h4>
                            <p className="text-xs text-white/60 truncate">{game.category}</p>
                          </div>`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', content);
console.log('patched starred games');
