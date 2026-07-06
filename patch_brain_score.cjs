const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                {/* Brain Score */}
                <div className="px-6 mb-8">
                  <h3 className="text-[16px] text-white font-medium tracking-wide mb-4">Brain Score</h3>
                  <div className="bg-[#141416] rounded-3xl p-6 pb-2 border border-white/5 relative overflow-hidden">`;

const replacement = `                {/* Circular Brain Score */}
                <div className="px-6 mb-8">
                  <div className="bg-[#0b0b10] rounded-[24px] p-6 relative overflow-hidden border border-white/5 shadow-xl">
                    <h3 className="text-[18px] text-white font-medium mb-6 relative z-10">Brain Score</h3>
                    <div className="flex flex-col items-center justify-center relative z-10">
                      <div className="relative w-[180px] h-[180px] flex items-center justify-center mb-6 mt-2">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#d946ef" />
                              <stop offset="50%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          <circle cx="50" cy="50" r="42" fill="none" stroke="#2a2a35" strokeWidth="6" />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="42" 
                            fill="none" 
                            stroke="url(#scoreGradient)" 
                            strokeWidth="6" 
                            strokeLinecap="round"
                            strokeDasharray="263.89" 
                            strokeDashoffset={263.89 - (263.89 * 0.842)}
                            filter="url(#glow)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[46px] font-bold text-white leading-none tracking-tight">842</span>
                          <span className="text-[17px] font-medium text-[#a855f7] mt-1">Great</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#22c55e] font-medium text-[15px]">
                        <TrendingUp className="w-4 h-4" />
                        <span>+62 this week</span>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brain Score Trend */}
                <div className="px-6 mb-8">
                  <h3 className="text-[16px] text-white font-medium tracking-wide mb-4">Score Trend</h3>
                  <div className="bg-[#141416] rounded-3xl p-6 pb-2 border border-white/5 relative overflow-hidden">`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Successfully added Circular Brain Score UI');
} else {
  console.log('Target for Circular Brain Score not found');
}
