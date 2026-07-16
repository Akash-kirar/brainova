const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const handleLogout = `
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    setOnboardingStep(0);
    setProfileName('');
  };
`;

content = content.replace('const [isLoggedIn, setIsLoggedIn] = useState(false);', 'const [isLoggedIn, setIsLoggedIn] = useState(false);\n' + handleLogout);

const appSettingsBtn = `                    <span className="font-medium">App Settings</span>
                  </button>`;

const logoutBtn = `                    <span className="font-medium">App Settings</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 text-left px-4 py-4 text-base text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <ArrowLeft className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="font-medium">Log Out</span>
                  </button>`;

content = content.replace(appSettingsBtn, logoutBtn);
fs.writeFileSync('src/App.tsx', content);
console.log('patched logout');
