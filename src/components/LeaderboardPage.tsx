import React, { useState } from 'react';
import { ChevronLeft, Crown, ChevronRight } from 'lucide-react';

interface LeaderboardPageProps {
  onBack: () => void;
  profileName?: string;
}

export default function LeaderboardPage({ onBack, profileName }: LeaderboardPageProps) {
  const [activeTab, setActiveTab] = useState<'Global' | 'Friends' | 'Country'>('Global');

  const [showMore, setShowMore] = useState(false);

  const initialUsers: Array<{rank: number, name: string, xp: string, image: string, isCurrentUser?: boolean}> = [
    { rank: 4, name: 'Priya', xp: '9,860 XP', image: 'https://i.pravatar.cc/150?u=4' },
    { rank: 5, name: profileName ? `${profileName} (You)` : "You", xp: '9,250 XP', isCurrentUser: true, image: 'https://i.pravatar.cc/150?u=5' },
    { rank: 6, name: 'Karan', xp: '8,730 XP', image: 'https://i.pravatar.cc/150?u=6' },
    { rank: 7, name: 'Sneha', xp: '7,890 XP', image: 'https://i.pravatar.cc/150?u=7' },
  ];
  
  const moreUsers: Array<{rank: number, name: string, xp: string, image: string, isCurrentUser?: boolean}> = [
    { rank: 8, name: 'Vikram', xp: '7,420 XP', image: 'https://i.pravatar.cc/150?u=8' },
    { rank: 9, name: 'Anita', xp: '7,100 XP', image: 'https://i.pravatar.cc/150?u=9' },
    { rank: 10, name: 'Rahul', xp: '6,850 XP', image: 'https://i.pravatar.cc/150?u=10' },
  ];

  const displayedUsers = showMore ? [...initialUsers, ...moreUsers] : initialUsers;

  return (
    <div className="flex flex-col h-[100dvh] bg-[#050505] font-sans text-white relative z-50">
      {/* Header */}
      <div className="flex items-center px-6 py-5 shrink-0 bg-[#050505] z-10 sticky top-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-bold text-[18px]">Leaderboard</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        
        {/* Tabs */}
        <div className="bg-[#121217] rounded-xl flex p-1 mb-8">
          {['Global', 'Friends', 'Country'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab 
                  ? 'bg-[#2e1b5b] text-white' 
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Podium */}
        <div className="flex justify-center items-end gap-2 mb-8 mt-12 px-2">
          
          {/* Rank 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 rounded-full border-2 border-slate-300 mb-2 relative">
              <img src="https://i.pravatar.cc/150?u=2" alt="Neha" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="bg-gradient-to-b from-slate-700 to-[#121217] w-full rounded-t-2xl flex flex-col items-center pt-4 pb-8 h-[140px] border border-white/5">
              <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold text-xs mb-2">2</div>
              <h3 className="font-bold text-white text-[16px] mb-1">Neha</h3>
              <span className="text-[12px] text-white/50">11,230 XP</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center flex-1 z-10">
            <Crown className="w-8 h-8 text-[#f59e0b] mb-1 fill-[#f59e0b]" />
            <div className="w-20 h-20 rounded-full border-4 border-[#f59e0b] mb-2 relative">
              <img src="https://i.pravatar.cc/150?u=1" alt="Rohit" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="bg-gradient-to-b from-yellow-700/80 to-[#121217] w-full rounded-t-2xl flex flex-col items-center justify-start pt-6 pb-12 h-[180px] shadow-[0_0_30px_rgba(245,158,11,0.15)] border border-yellow-500/20">
              <div className="text-[#fcd34d] font-bold text-3xl mb-2">1</div>
              <h3 className="font-bold text-white text-[18px] mb-1">Rohit</h3>
              <span className="text-[13px] text-white/70">12,560 XP</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 rounded-full border-2 border-orange-700 mb-2 relative">
               <img src="https://i.pravatar.cc/150?u=3" alt="Arjun" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="bg-gradient-to-b from-orange-900/60 to-[#121217] w-full rounded-t-2xl flex flex-col items-center pt-4 pb-8 h-[120px] border border-orange-500/10">
              <div className="w-6 h-6 rounded-full bg-orange-700 flex items-center justify-center text-white font-bold text-xs mb-2">3</div>
              <h3 className="font-bold text-white text-[16px] mb-1">Arjun</h3>
              <span className="text-[12px] text-white/50">10,490 XP</span>
            </div>
          </div>

        </div>

        {/* List */}
        <div className="bg-[#121217] rounded-2xl p-2 border border-white/5">
          {displayedUsers.map((user, idx) => (
            <div 
              key={user.rank} 
              className={`flex items-center gap-4 p-3 rounded-xl ${
                idx !== displayedUsers.length - 1 || !showMore ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="w-6 font-bold text-white/70 text-center">{user.rank}</div>
              <div className={`w-10 h-10 rounded-full border-2 ${user.isCurrentUser ? 'border-[#10b981]' : 'border-white/10'} overflow-hidden shrink-0`}>
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className={`flex-1 font-bold ${user.isCurrentUser ? 'text-[#10b981]' : 'text-white'}`}>
                {user.name}
              </div>
              <div className="text-[14px] text-white/60">{user.xp}</div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </div>
          ))}
          {!showMore && (
            <button 
              onClick={() => setShowMore(true)}
              className="w-full text-center py-4 font-medium text-white/70 hover:text-white transition-colors text-[14px]"
            >
              More
            </button>
          )}
        </div>

        <p className="text-center text-white/30 text-[13px] mt-8">
          Leaderboard updates in real-time
        </p>

      </div>
    </div>
  );
}
