const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove Akash default
content = content.replace(/useState\('Akash'\)/g, "useState('')");

// 2. Greeting
// return \`\${greeting}, \${profileName.split(" ")[0]} 👋\`;
content = content.replace(/return \`\\\$\\{greeting\\}, \\\$\\{profileName\.split\(" "\)\[0\]\\} 👋\`;/g, 'return `${greeting}${profileName ? `, ${profileName.split(" ")[0]}` : ""} 👋`;');

// 3. Initials
// <span className="text-[32px] font-medium text-white">{profileName.charAt(0).toUpperCase()}</span>
content = content.replace(
  /<span className="text-\[32px\] font-medium text-white">\{profileName\.charAt\(0\)\.toUpperCase\(\)\}<\/span>/g,
  '<span className="text-[32px] font-medium text-white">{(profileName || "U").charAt(0).toUpperCase()}</span>'
);

// 4. Update LeaderboardPage usage
// <LeaderboardPage onBack={() => setIsLeaderboardOpen(false)} />
content = content.replace(
  /<LeaderboardPage onBack=\{\(\) => setIsLeaderboardOpen\(false\)\} \/>/g,
  '<LeaderboardPage onBack={() => setIsLeaderboardOpen(false)} profileName={profileName} />'
);

fs.writeFileSync('src/App.tsx', content);
