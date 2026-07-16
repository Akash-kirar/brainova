const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-12 pb-8 bg-gradient-to-b from-[#050117]/90 via-[#050117]/60 to-transparent pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto drop-shadow-md">
                      <button 
                        onClick={() => setIsXpRoadmapOpen(false)}
                        className="p-1.5 rounded-full bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <h2 className="text-xl font-bold text-white tracking-tight">Journey Map</h2>
                    </div>`;

const replaceStr = `                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-12 pb-8 pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto drop-shadow-md">
                      <button 
                        onClick={() => setIsXpRoadmapOpen(false)}
                        className="p-1.5 rounded-full bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                    </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log('patched');
} else {
  console.log('target not found');
}
