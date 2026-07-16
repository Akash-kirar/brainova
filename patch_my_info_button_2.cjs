const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const target = '              ))}';
const replacement = `              ))}
            </div>

            <button
              onClick={() => onOpenProfile && onOpenProfile()}
              className="w-full mt-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-indigo-500/20 transition-colors"
            >
              <User className="w-5 h-5" />
              My Information
            </button>
          `;

// Replace first match after 'Start a Conversation'
const parts = content.split('Start a Conversation');
parts[1] = parts[1].replace('              ))}\n            </div>', replacement);
content = parts.join('Start a Conversation');

fs.writeFileSync('src/components/AiCoachView.tsx', content);
console.log("Patched AiCoachView 2");
