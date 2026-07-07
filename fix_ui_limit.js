const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

// Replace the container padding
content = content.replace(
  'p-2 pl-4 flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)]',
  'py-2.5 pl-6 pr-3 flex items-center gap-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
);

// Replace the limit text
content = content.replace(
  /\{\(\!hasTokens \|\| \(tokensRemaining <= \(isPro \? 10 : 2\)\)\) \&\& mode === 'chat' \&\& \(/,
  `{mode === 'chat' && (`
);

content = content.replace(
  /\{tokensRemaining\} \{isPro \? "Pro" : "free"\} messages remaining\./,
  `{tokensRemaining} / {limit} {isPro ? "Pro" : "free"} messages remaining this month.`
);

fs.writeFileSync('src/components/AiCoachView.tsx', content);
