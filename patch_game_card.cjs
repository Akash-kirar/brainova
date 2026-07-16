const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr1 = `                            <h3 className="text-white font-bold mb-1 truncate w-full">{game.title}</h3>
                            <p className="text-white/50 text-xs w-full line-clamp-2">{game.description}</p>
                          </button>`;

const replaceStr1 = `                            <h3 className="text-white font-bold mb-1 truncate w-full">{game.title}</h3>
                            <p className="text-white/50 text-xs w-full line-clamp-2">{game.description}</p>
                            {(game as any).isPremium && (
                               <div className="absolute bottom-4 right-4 z-20 opacity-60">
                                 <Crown className="w-5 h-5 text-[#f59e0b]" />
                               </div>
                            )}
                          </button>`;

const targetStr2 = `                            <h3 className="text-lg font-bold mb-1 relative z-10">{game.title}</h3>
                            <p className="text-xs text-white/50 leading-relaxed relative z-10">{game.description}</p>
                          </button>`;

const replaceStr2 = `                            <h3 className="text-lg font-bold mb-1 relative z-10">{game.title}</h3>
                            <p className="text-xs text-white/50 leading-relaxed relative z-10">{game.description}</p>
                            {(game as any).isPremium && (
                               <div className="absolute bottom-4 right-4 z-20 opacity-60">
                                 <Crown className="w-5 h-5 text-[#f59e0b]" />
                               </div>
                            )}
                          </button>`;

if (content.includes(targetStr1) || content.includes(targetStr2)) {
  content = content.replace(targetStr1, replaceStr1);
  content = content.replace(targetStr2, replaceStr2);
  fs.writeFileSync('src/App.tsx', content);
  console.log('patched game cards');
} else {
  console.log('target not found for game cards');
}
