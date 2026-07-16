const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /const userRank = Math.max\(1, 5 - Math.floor\(totalXP \/ 2000\)\);/g,
  'const userRank = Math.max(1, 10000 - Math.floor(totalXP / 10));'
);
fs.writeFileSync('src/App.tsx', appContent);

// Patch LeaderboardPage.tsx
let lbContent = fs.readFileSync('src/components/LeaderboardPage.tsx', 'utf8');

const oldComponentStart = `export default function LeaderboardPage({ onBack, profileName }: LeaderboardPageProps) {
  const [showMore, setShowMore] = useState(false);
  const { sessions } = useProgress();

  const totalXP = sessions.reduce((acc, curr) => acc + curr.score, 0);
  const userRank = Math.max(1, 5 - Math.floor(totalXP / 2000));

  const names = ['Priya', 'Karan', 'Sneha', 'Vikram', 'Anita', 'Rahul', 'Anjali', 'Dev', 'Maya', 'Ravi'];
  
  const generateFakeUser = (rank: number, index: number) => {
    const baseFakeXp = totalXP === 0 ? 9250 : totalXP; 
    const fakeXp = Math.max(0, baseFakeXp + ((userRank - rank) * 610) + Math.floor(Math.random() * 50)); 
    return {
      rank,
      name: names[index % names.length],
      xp: \`\${fakeXp.toLocaleString()} XP\`,
      image: \`https://i.pravatar.cc/150?u=\${rank}\`,
    };
  };`;

const newComponentStart = `export default function LeaderboardPage({ onBack, profileName }: LeaderboardPageProps) {
  const [showMore, setShowMore] = useState(false);
  const { sessions } = useProgress();

  const totalXP = sessions.reduce((acc, curr) => acc + curr.score, 0);
  const userRank = Math.max(1, 10000 - Math.floor(totalXP / 10));

  const names = ['Priya', 'Karan', 'Sneha', 'Vikram', 'Anita', 'Rahul', 'Anjali', 'Dev', 'Maya', 'Ravi'];
  
  const generateFakeUser = (rank: number, index: number) => {
    let fakeXp = (10000 - rank) * 10 + (rank % 7);
    if (fakeXp < 0) fakeXp = 0;
    // ensure people above user have more XP if user is close
    if (rank < userRank && fakeXp <= totalXP) {
       fakeXp = totalXP + (userRank - rank) * 5 + (rank % 7);
    }
    if (rank > userRank && fakeXp >= totalXP) {
       fakeXp = Math.max(0, totalXP - (rank - userRank) * 5 - (rank % 7));
    }
    return {
      rank,
      name: names[index % names.length],
      xp: \`\${fakeXp.toLocaleString()} XP\`,
      image: \`https://i.pravatar.cc/150?u=\${rank}\`,
    };
  };`;

lbContent = lbContent.replace(oldComponentStart, newComponentStart);

// Patch podium logic
const oldPodiumLogic = `  const getPodiumUser = (targetRank: number) => {
    if (userRank === targetRank) {
      return {
        name: profileName ? \`\${profileName} (You)\` : "You",
        xp: \`\${totalXP.toLocaleString()} XP\`,
        image: 'https://i.pravatar.cc/150?u=99',
        isCurrentUser: true
      };
    }
    const defaultPodium = [
      { name: 'Rohit', xp: '12,560 XP', image: 'https://i.pravatar.cc/150?u=1' },
      { name: 'Neha', xp: '11,230 XP', image: 'https://i.pravatar.cc/150?u=2' },
      { name: 'Arjun', xp: '10,490 XP', image: 'https://i.pravatar.cc/150?u=3' }
    ];
    return defaultPodium[targetRank - 1];
  };`;

const newPodiumLogic = `  const getPodiumUser = (targetRank: number) => {
    if (userRank === targetRank) {
      return {
        name: profileName ? \`\${profileName} (You)\` : "You",
        xp: \`\${totalXP.toLocaleString()} XP\`,
        image: 'https://i.pravatar.cc/150?u=99',
        isCurrentUser: true
      };
    }
    
    let fakeXp = (10000 - targetRank) * 10 + (targetRank % 7);
    if (targetRank < userRank && fakeXp <= totalXP) {
       fakeXp = totalXP + (userRank - targetRank) * 5 + (targetRank % 7);
    }
    
    const defaultPodium = [
      { name: 'Rohit', xp: \`\${fakeXp.toLocaleString()} XP\`, image: 'https://i.pravatar.cc/150?u=1' },
      { name: 'Neha', xp: \`\${fakeXp.toLocaleString()} XP\`, image: 'https://i.pravatar.cc/150?u=2' },
      { name: 'Arjun', xp: \`\${fakeXp.toLocaleString()} XP\`, image: 'https://i.pravatar.cc/150?u=3' }
    ];
    return defaultPodium[targetRank - 1];
  };`;

lbContent = lbContent.replace(oldPodiumLogic, newPodiumLogic);

fs.writeFileSync('src/components/LeaderboardPage.tsx', lbContent);
