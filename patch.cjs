const fs = require('fs');
let file = 'src/features/onboarding/components/OnboardingScreens.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `    },
    {
      buttonText: "Next",
      content: (
        <div className="flex flex-col items-center w-full text-center">
          <h2 className="text-4xl font-black tracking-tight mb-3 uppercase flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-400 w-6 h-6" />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">WIN TO RISE</span>
            <Sparkles className="text-cyan-400 w-6 h-6" />
          </h2>
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-2 h-2 rounded-full bg-blue-500 rotate-45"></div>
            <p className="text-sm text-gray-300">Earn rating. Climb the leaderboard.</p>
            <div className="w-2 h-2 rounded-full bg-blue-500 rotate-45"></div>
          </div>
          
          <div className="w-full flex items-end justify-center h-56 mb-8 gap-1.5 px-4">
             {/* 2nd Place */}
             <div className="w-[30%] flex flex-col items-center relative">
               <div className="w-16 h-16 rounded-full bg-[#fbcfe8] mb-2 border-[3px] border-pink-400 relative flex items-center justify-center shadow-[0_0_20px_rgba(244,114,182,0.6)] z-10">
                 <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <circle cx="50" cy="50" r="45" fill="#f472b6"/>
                    <circle cx="50" cy="65" r="25" fill="#fbcfe8"/>
                    <circle cx="35" cy="45" r="5" fill="#000"/>
                    <circle cx="65" cy="45" r="5" fill="#000"/>
                    <circle cx="50" cy="55" r="3" fill="#000"/>
                    <path d="M 45 65 Q 50 70 55 65" stroke="#000" strokeWidth="2" fill="none"/>
                    <circle cx="20" cy="30" r="15" fill="#f472b6"/>
                    <circle cx="80" cy="30" r="15" fill="#f472b6"/>
                 </svg>
                 <CrownSVG className="w-8 h-8 absolute -top-5 -left-3 rotate-[-15deg]" color="#facc15" />
               </div>
               <div className="w-full h-28 bg-gradient-to-t from-purple-800 to-purple-600 rounded-t-xl border-t border-purple-400 flex flex-col items-start pt-4 justify-start items-center shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                 <span className="font-black text-2xl">405</span>
                 <div className="flex gap-1 mt-1"><Star/><Star/><Star/></div>
               </div>
             </div>
             
             {/* 1st Place */}
             <div className="w-[40%] flex flex-col items-center relative z-20">
               <div className="w-20 h-20 rounded-full bg-[#bae6fd] mb-2 border-[3px] border-blue-400 relative flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.8)]">
                 <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <path d="M 20 80 Q 50 20 80 80 Z" fill="#7dd3fc" />
                    <circle cx="50" cy="65" r="25" fill="#e0f2fe"/>
                    <circle cx="35" cy="50" r="6" fill="#000"/>
                    <circle cx="65" cy="50" r="6" fill="#000"/>
                    <circle cx="50" cy="60" r="4" fill="#000"/>
                    <path d="M 45 70 Q 50 75 55 70" stroke="#000" strokeWidth="3" fill="none"/>
                    <path d="M 25 40 L 30 15 L 45 30 Z" fill="#7dd3fc" />
                    <path d="M 75 40 L 70 15 L 55 30 Z" fill="#7dd3fc" />
                 </svg>
                 <CrownSVG className="w-12 h-12 absolute -top-8" color="#facc15" />
               </div>
               <div className="w-full h-36 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-xl border-t-2 border-blue-300 flex flex-col items-center pt-5 shadow-[0_0_40px_rgba(59,130,246,0.6)]">
                 <span className="font-black text-3xl">605</span>
                 <div className="flex gap-1 mt-2"><Star/><Star/><Star/></div>
               </div>
             </div>
             
             {/* 3rd Place */}
             <div className="w-[30%] flex flex-col items-center relative">
               <div className="w-16 h-16 rounded-full bg-[#fbcfe8] mb-2 border-[3px] border-pink-500 relative flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.6)] z-10">
                 <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <circle cx="50" cy="50" r="45" fill="#f472b6"/>
                    <circle cx="35" cy="45" r="5" fill="#000"/>
                    <circle cx="65" cy="45" r="5" fill="#000"/>
                    <circle cx="50" cy="55" r="3" fill="#000"/>
                    <path d="M 42 62 Q 50 68 58 62" stroke="#000" strokeWidth="2" fill="none"/>
                 </svg>
                 <CrownSVG className="w-8 h-8 absolute -top-4 -right-3 rotate-[15deg]" color="#22d3ee" />
               </div>
               <div className="w-full h-24 bg-gradient-to-t from-pink-700 to-pink-500 rounded-t-xl border-t border-pink-400 flex flex-col pt-3 items-center shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                 <span className="font-black text-2xl">505</span>
                 <div className="flex gap-1 mt-1"><Star/><Star/><Star/></div>
               </div>
             </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 w-full">
             <InfoCard icon={<BarChart2 className="w-8 h-8 text-purple-400" />} title="Real-time Leaderboards" titleColor="text-purple-400" desc="See your rank and compete live!" />
             <InfoCard icon={<Users className="w-8 h-8 text-cyan-400" />} title="Compete with Others" titleColor="text-cyan-400" desc="Challenge players and win!" />
             <InfoCard icon={<Brain className="w-8 h-8 text-orange-400" />} title="Prove Your Brainpower" titleColor="text-orange-400" desc="Test your skills and grow smarter!" />
          </div>
        </div>
      )
    },`;

content = content.replace(targetContent, "    },");
fs.writeFileSync(file, content);
