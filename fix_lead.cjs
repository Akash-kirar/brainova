const fs = require('fs');
let code = fs.readFileSync('src/components/LeaderboardPage.tsx', 'utf8');

code = code.replace(/\/\/ isCurrentUser: true,/g, 'isCurrentUser: true,');

// Find where initialUsers is defined and add type
code = code.replace(/const initialUsers = \[/g, 'const initialUsers: Array<{rank: number, name: string, xp: string, image: string, isCurrentUser?: boolean}> = [');
code = code.replace(/const moreUsers = \[/g, 'const moreUsers: Array<{rank: number, name: string, xp: string, image: string, isCurrentUser?: boolean}> = [');

fs.writeFileSync('src/components/LeaderboardPage.tsx', code);
