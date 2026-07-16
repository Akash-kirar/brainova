const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `<motion.div 
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  className="fixed inset-0 z-50 bg-[#0a0a0c] flex flex-col"
                >
                  <div className="flex items-center justify-between px-5 pt-12 pb-4 bg-[#0a0a0c]">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsXpRoadmapOpen(false)}
                        className="p-1.5 rounded-full bg-transparent hover:bg-white/10 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <h2 className="text-xl font-bold text-white tracking-tight">Journey Map</h2>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-[#1a2b5e]/40 border border-[#3b82f6]/20 px-3 py-1.5 rounded-full">
                      <div className="w-5 h-5 bg-[#3b82f6] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-[10px]">XP</span>
                      </div>
                      <span className="text-white font-bold text-sm tracking-wide">{totalXP}</span>
                    </div>
                  </div>
                  <div ref={mapContainerRef} className="flex-1 overflow-y-auto hide-scrollbar relative bg-[#02020a]">`;

const replaceStr = `<motion.div 
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  className="fixed inset-0 z-50 bg-[#02020a] flex flex-col"
                >
                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-12 pb-8 bg-gradient-to-b from-[#050117]/90 via-[#050117]/60 to-transparent pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto drop-shadow-md">
                      <button 
                        onClick={() => setIsXpRoadmapOpen(false)}
                        className="p-1.5 rounded-full bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <h2 className="text-xl font-bold text-white tracking-tight">Journey Map</h2>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-[#1a2b5e]/60 border border-[#3b82f6]/30 px-3 py-1.5 rounded-full backdrop-blur-md pointer-events-auto drop-shadow-md">
                      <div className="w-5 h-5 bg-[#3b82f6] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-[10px]">XP</span>
                      </div>
                      <span className="text-white font-bold text-sm tracking-wide">{totalXP}</span>
                    </div>
                  </div>
                  <div ref={mapContainerRef} className="flex-1 overflow-y-auto hide-scrollbar relative bg-[#02020a]">`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log('patched');
} else {
  console.log('target not found');
}
