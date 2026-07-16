const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const replacement = `                </button>
              ))}
            </div>

            <button
              onClick={() => onOpenProfile && onOpenProfile()}
              className="w-full mt-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-indigo-500/20 transition-colors"
            >
              <User className="w-5 h-5" />
              My Information
            </button>
          </div>
`;

content = content.replace(`                </button>
              ))}
            </div>
          </div>`, replacement);

if (content.includes('My Information')) {
  if (!content.includes('User ')) {
    content = content.replace('import { ChevronLeft', 'import { User, ChevronLeft');
  }
}

fs.writeFileSync('src/components/AiCoachView.tsx', content);
console.log("Patched AiCoachView");
