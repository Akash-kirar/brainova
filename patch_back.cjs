const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-start px-4 pt-4 pb-2 pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto drop-shadow-md">
                      <button 
                        onClick={() => setIsXpRoadmapOpen(false)}
                        className="p-1.5 rounded-full bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
                      >
                        <ArrowLeft className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>`;

const replaceStr = `                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-start px-4 pt-4 pb-2 pointer-events-none">
                    <div className="flex items-center pointer-events-auto drop-shadow-md">
                      <button 
                        onClick={() => setIsXpRoadmapOpen(false)}
                        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
                      >
                        <ArrowLeft className="w-5 h-5 text-white" />
                        <span className="text-white text-sm font-medium">Back</span>
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
