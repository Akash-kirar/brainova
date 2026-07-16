const fs = require('fs');
let content = fs.readFileSync('src/components/LeaderboardPage.tsx', 'utf8');

const oldRegex = /  const generateFakeUser = \(rank: number, index: number\) => \{[\s\S]*?const displayedUsers = showMore \? \[\.\.\.initialUsers, \.\.\.moreUsers\] : initialUsers;/m;

const newReplacement = `  const maxRank = 50;
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
      xp: \`\${fakeXp.toLocaleString()} XP\`,
      image: \`https://i.pravatar.cc/150?u=\${rank}\`,
    };
  };

  const allListUsers = [];
  for (let r = 4; r <= maxRank; r++) {
    if (r === userRank) {
      allListUsers.push({
        rank: userRank,
        name: profileName ? \`\${profileName} (You)\` : "You",
        xp: \`\${totalXP.toLocaleString()} XP\`,
        isCurrentUser: true,
        image: 'https://i.pravatar.cc/150?u=99'
      });
    } else {
      allListUsers.push(generateFakeUser(r, r));
    }
  }

  const initialUsers = allListUsers.slice(0, 7);
  const moreUsers = allListUsers.slice(7);

  const displayedUsers = showMore ? allListUsers : initialUsers;`;

content = content.replace(oldRegex, newReplacement);

// Also we need to replace the old userRank definition at the top of the component so it doesn't conflict
content = content.replace(/  const userRank = Math\.max\(1, 10000 - Math\.floor\(totalXP \/ 10\)\);\n/, '');

// Also patch podium logic
const podiumRegex = /    let fakeXp = \(10000 - targetRank\) \* 10 \+ \(targetRank % 7\);/g;
content = content.replace(podiumRegex, '    let fakeXp = (50 - targetRank) * 50 + (targetRank % 7) * 10;');

fs.writeFileSync('src/components/LeaderboardPage.tsx', content);
