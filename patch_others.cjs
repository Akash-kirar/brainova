const fs = require('fs');

// Patch LeaderboardPage.tsx
let lp = fs.readFileSync('src/components/LeaderboardPage.tsx', 'utf8');

lp = lp.replace(
  /interface LeaderboardPageProps \{\n  onBack: \(\) => void;\n\}/g,
  'interface LeaderboardPageProps {\n  onBack: () => void;\n  profileName?: string;\n}'
);

lp = lp.replace(
  /export default function LeaderboardPage\(\{ onBack \}: LeaderboardPageProps\) \{/g,
  'export default function LeaderboardPage({ onBack, profileName }: LeaderboardPageProps) {'
);

lp = lp.replace(
  /name: 'Akash \(You\)'/g,
  'name: profileName ? `${profileName} (You)` : "You"'
);

fs.writeFileSync('src/components/LeaderboardPage.tsx', lp);


// Patch AuthScreen.tsx
let as = fs.readFileSync('src/features/auth/components/AuthScreen.tsx', 'utf8');

const socialLoginStr = `                <button 
                  onClick={() => onLogin(signupName)}
                  className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-[0.95] active:scale-90 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <GoogleIcon />
                </button>
                <button 
                  onClick={() => onLogin(signupName)}
                  className="w-14 h-14 rounded-2xl text-white flex items-center justify-center hover:scale-[0.95] active:scale-90 transition-transform shadow-lg"
                  style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                >
                  <InstagramIcon />
                </button>
                <button 
                  onClick={() => onLogin(signupName)}
                  className="w-14 h-14 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center hover:scale-[0.95] active:scale-90 transition-transform shadow-lg"
                >
                  <FacebookIcon />
                </button>`;

const newSocialLoginStr = `                <button 
                  onClick={() => { const name = prompt("Enter your name to simulate fetching profile:") || ''; onLogin(name); }}
                  className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-[0.95] active:scale-90 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <GoogleIcon />
                </button>
                <button 
                  onClick={() => { const name = prompt("Enter your name to simulate fetching profile:") || ''; onLogin(name); }}
                  className="w-14 h-14 rounded-2xl text-white flex items-center justify-center hover:scale-[0.95] active:scale-90 transition-transform shadow-lg"
                  style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                >
                  <InstagramIcon />
                </button>
                <button 
                  onClick={() => { const name = prompt("Enter your name to simulate fetching profile:") || ''; onLogin(name); }}
                  className="w-14 h-14 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center hover:scale-[0.95] active:scale-90 transition-transform shadow-lg"
                >
                  <FacebookIcon />
                </button>`;

as = as.replace(socialLoginStr, newSocialLoginStr);
fs.writeFileSync('src/features/auth/components/AuthScreen.tsx', as);

