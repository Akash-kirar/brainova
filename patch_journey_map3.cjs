const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-12 pb-8 pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto drop-shadow-md">
                      <button 
                        onClick={() => setIsXpRoadmapOpen(false)}
                        className="p-1.5 rounded-full bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-[#1a2b5e]/60 border border-[#3b82f6]/30 px-3 py-1.5 rounded-full backdrop-blur-md pointer-events-auto drop-shadow-md">
                      <div className="w-5 h-5 bg-[#3b82f6] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-[10px]">XP</span>
                      </div>
                      <span className="text-white font-bold text-sm tracking-wide">{totalXP}</span>
                    </div>
                  </div>`;

const replaceStr = `                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-12 pb-8 pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto drop-shadow-md">
                      <button 
                        onClick={() => setIsXpRoadmapOpen(false)}
                        className="p-1.5 rounded-full bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log('patched');
} else {
  console.log('target not found');
}
