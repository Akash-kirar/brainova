const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

content = content.replace(
  /<button onClick=\{onSend\} className="text-\[#a855f7\] hover:text-\[#c084fc\] ml-1 font-bold">Upgrade<\/button>/g,
  `{!isPro ? (
                  <button onClick={onSend} className="text-[#a855f7] hover:text-[#c084fc] ml-1 font-bold">Upgrade</button>
                ) : (
                  !hasTokens && <span className="text-white/40 ml-1">Wait for next month.</span>
                )}`
);

fs.writeFileSync('src/components/AiCoachView.tsx', content);
