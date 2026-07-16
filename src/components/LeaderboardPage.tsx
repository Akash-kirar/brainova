import React, { useState } from 'react';
import { ChevronLeft, Crown, ChevronRight } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

interface LeaderboardPageProps {
  onBack: () => void;
  profileName?: string;
}

export default function LeaderboardPage({ onBack, profileName }: LeaderboardPageProps) {
  const [showMore, setShowMore] = useState(false);
  const { sessions } = useProgress();

  const totalXP = sessions.reduce((acc, curr) => acc + curr.score, 0);

  const names = ['Priya', 'Karan', 'Sneha', 'Vikram', 'Anita', 'Rahul', 'Anjali', 'Dev', 'Maya', 'Ravi'];
  
  const maxRank = 50;
  const userRank = Math.max(1, maxRank - Math.floor(totalXP / 50));

  const generateFakeUser = (rank: number, index: number) => {
    let fakeXp = (maxRank - rank) * 50 + (rank % 7) * 10;
    if (fakeXp < 0) fakeXp = 0;
    
    if (rank < userRank && fakeXp <= totalXP) {
       fakeXp = totalXP + (userRank - rank) * 25 + (rank % 7);
    }
    if (rank > userRank && fakeXp >= totalXP) {
       fakeXp = Math.max(0, totalXP - (rank - userRank) * 25 - (rank % 7));
    }
    
    return {
      rank,
      name: names[index % names.length],
      xp: `${fakeXp.toLocaleString()} XP`,
      image: `https://i.pravatar.cc/150?u=${rank}`,
    };
  };

  const allListUsers = [];
  for (let r = 4; r <= maxRank; r++) {
    if (r === userRank) {
      allListUsers.push({
        rank: userRank,
        name: profileName ? `${profileName} (You)` : "You",
        xp: `${totalXP.toLocaleString()} XP`,
        isCurrentUser: true,
        image: 'https://i.pravatar.cc/150?u=99'
      });
    } else {
      allListUsers.push(generateFakeUser(r, r));
    }
  }

  let initialUsers = allListUsers.slice(0, 7);
  if (userRank > 10) {
    const userEntry = allListUsers.find(u => u.isCurrentUser);
    if (userEntry) {
      initialUsers = [...allListUsers.slice(0, 6), userEntry];
    }
  }
  
  const displayedUsers = showMore ? allListUsers : initialUsers;
  
  // Podium Logic
  const getPodiumUser = (targetRank: number) => {
    if (userRank === targetRank) {
      return {
        name: profileName ? `${profileName} (You)` : "You",
        xp: `${totalXP.toLocaleString()} XP`,
        image: 'https://i.pravatar.cc/150?u=99',
        isCurrentUser: true
      };
    }
    
    let fakeXp = (50 - targetRank) * 50 + (targetRank % 7) * 10;
    if (targetRank < userRank && fakeXp <= totalXP) {
       fakeXp = totalXP + (userRank - targetRank) * 5 + (targetRank % 7);
    }
    
    const defaultPodium = [
      { name: 'Rohit', xp: `${fakeXp.toLocaleString()} XP`, image: 'https://i.pravatar.cc/150?u=1', isCurrentUser: false },
      { name: 'Neha', xp: `${fakeXp.toLocaleString()} XP`, image: 'https://i.pravatar.cc/150?u=2', isCurrentUser: false },
      { name: 'Arjun', xp: `${fakeXp.toLocaleString()} XP`, image: 'https://i.pravatar.cc/150?u=3', isCurrentUser: false }
    ];
    return defaultPodium[targetRank - 1];
  };

  const rank1 = getPodiumUser(1);
  const rank2 = getPodiumUser(2);
  const rank3 = getPodiumUser(3);


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
        
        {/* Tabs removed */}

        {/* Podium */}
        <div className="flex justify-center items-end gap-2 mb-8 mt-12 px-2">
          
          {/* Rank 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-16 h-16 rounded-full border-2 ${rank2.isCurrentUser ? 'border-[#10b981]' : 'border-slate-300'} mb-2 relative`}>
              <img src={rank2.image} alt={rank2.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="bg-gradient-to-b from-slate-700 to-[#121217] w-full rounded-t-2xl flex flex-col items-center pt-4 pb-8 h-[140px] border border-white/5">
              <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold text-xs mb-2">2</div>
              <h3 className={`font-bold ${rank2.isCurrentUser ? 'text-[#10b981]' : 'text-white'} text-[16px] mb-1`}>{rank2.name}</h3>
              <span className="text-[12px] text-white/50">{rank2.xp}</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center flex-1 z-10">
            <Crown className="w-8 h-8 text-[#f59e0b] mb-1 fill-[#f59e0b]" />
            <div className={`w-20 h-20 rounded-full border-4 ${rank1.isCurrentUser ? 'border-[#10b981]' : 'border-[#f59e0b]'} mb-2 relative`}>
              <img src={rank1.image} alt={rank1.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="bg-gradient-to-b from-yellow-700/80 to-[#121217] w-full rounded-t-2xl flex flex-col items-center justify-start pt-6 pb-12 h-[180px] shadow-[0_0_30px_rgba(245,158,11,0.15)] border border-yellow-500/20">
              <div className="text-[#fcd34d] font-bold text-3xl mb-2">1</div>
              <h3 className={`font-bold ${rank1.isCurrentUser ? 'text-[#10b981]' : 'text-white'} text-[18px] mb-1`}>{rank1.name}</h3>
              <span className="text-[13px] text-white/70">{rank1.xp}</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-16 h-16 rounded-full border-2 ${rank3.isCurrentUser ? 'border-[#10b981]' : 'border-orange-700'} mb-2 relative`}>
               <img src={rank3.image} alt={rank3.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="bg-gradient-to-b from-orange-900/60 to-[#121217] w-full rounded-t-2xl flex flex-col items-center pt-4 pb-8 h-[120px] border border-orange-500/10">
              <div className="w-6 h-6 rounded-full bg-orange-700 flex items-center justify-center text-white font-bold text-xs mb-2">3</div>
              <h3 className={`font-bold ${rank3.isCurrentUser ? 'text-[#10b981]' : 'text-white'} text-[16px] mb-1`}>{rank3.name}</h3>
              <span className="text-[12px] text-white/50">{rank3.xp}</span>
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
