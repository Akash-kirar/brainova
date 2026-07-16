const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const targetStr = `              ))}
            </div>
          </div>
        </div>
      ) : (`;

const newStr = `              ))}
            </div>

            <button
              onClick={() => onOpenProfile && onOpenProfile()}
              className="w-full mt-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-indigo-500/20 transition-colors shadow-sm"
            >
              <User className="w-5 h-5" />
              My Information
            </button>
          </div>
        </div>
      ) : (`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/components/AiCoachView.tsx', content);
  console.log("Replaced successfully!");
} else {
  console.log("Target not found!");
}
