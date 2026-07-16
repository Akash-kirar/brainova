const fs = require('fs');
let content = fs.readFileSync('src/components/LeaderboardPage.tsx', 'utf8');

const regex = /  const initialUsers = allListUsers\.slice\(0, 7\);\n  const moreUsers = allListUsers\.slice\(7\);\n\n  const displayedUsers = showMore \? allListUsers : initialUsers;/g;

const replacement = `  let initialUsers = allListUsers.slice(0, 7);
  if (userRank > 10) {
    const userEntry = allListUsers.find(u => u.isCurrentUser);
    if (userEntry) {
      initialUsers = [...allListUsers.slice(0, 6), userEntry];
    }
  }
  
  const displayedUsers = showMore ? allListUsers : initialUsers;`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/LeaderboardPage.tsx', content);
