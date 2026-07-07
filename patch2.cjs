const fs = require('fs');
let file = 'src/components/OnboardingScreens.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `    },
    {
      title: "WIN TO RISE",
      subtitle: "EARN RATING. CLIMB THE LEADERBOARD.",
      illustration: (
        <div className="relative w-full h-80 flex items-end justify-center pb-12">
          {/* Background glow */}
          <div className="absolute top-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]"></div>
          
          {/* Podium */}
          <div className="flex items-end gap-0 h-48 relative z-10">
            <div className="w-20 h-28 bg-[#6366f1] relative flex justify-center border-t border-white/20 shadow-lg">
              <span className="absolute top-4 text-white font-bold text-lg">405</span>
              <div className="absolute -top-10 w-14 h-14 rounded-full bg-gradient-to-br from-[#f472b6] to-[#c084fc] shadow-[0_0_20px_rgba(192,132,252,0.4)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0f172a] transform rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 11 Q 7 14 9 11" />
                  <path d="M13 11 Q 15 14 17 11" />
                  <path d="M11 7 L 11 16 L 8 16" />
                </svg>
                <Crown className="w-5 h-5 text-orange-500 absolute -top-4 -left-2 transform -rotate-12" />
              </div>
            </div>
            <div className="w-24 h-48 bg-[#818cf8] relative flex justify-center border-t border-white/20 shadow-2xl z-10">
              <span className="absolute top-4 text-white font-bold text-xl">605</span>
              <div className="absolute -top-16 w-20 h-20 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#0f172a] transform -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 11 Q 9 14 11 11" />
                  <path d="M15 11 Q 17 14 19 11" />
                  <path d="M13 7 L 13 16 L 16 16" />
                </svg>
                <Crown className="w-8 h-8 text-yellow-400 absolute -top-6 transform rotate-12" />
              </div>
            </div>
            <div className="w-20 h-36 bg-[#4f46e5] relative flex justify-center border-t border-white/20 shadow-lg">
              <span className="absolute top-4 text-white font-bold text-lg">505</span>
              <div className="absolute -top-10 w-14 h-14 rounded-full bg-gradient-to-br from-[#f472b6] to-[#c084fc] shadow-[0_0_20px_rgba(192,132,252,0.4)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0f172a] transform rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 11 Q 7 14 9 11" />
                  <path d="M13 11 Q 15 14 17 11" />
                  <path d="M11 7 L 11 16 L 8 16" />
                </svg>
                <Crown className="w-5 h-5 text-gray-400 absolute -top-4 -right-2 transform rotate-12" />
              </div>
            </div>
          </div>
        </div>
      )
    },`;

content = content.replace(targetContent, "    },");
fs.writeFileSync(file, content);
