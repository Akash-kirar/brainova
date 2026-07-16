const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const badBtn = `
            <button
              onClick={() => onOpenProfile && onOpenProfile()}
              className="w-full mt-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-indigo-500/20 transition-colors shadow-sm"
            >
              <User className="w-5 h-5" />
              My Information
            </button>`;

content = content.replace(badBtn, '');

const quickActionsTarget = `          {/* Quick Actions */}`;
const newBtn = `          {/* My Information Button */}
          <div className="px-6 flex justify-center -mt-2 mb-2">
            <button
              onClick={() => onOpenProfile && onOpenProfile()}
              className="w-full max-w-[260px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold rounded-2xl py-2.5 flex items-center justify-center gap-2 hover:bg-indigo-500/20 transition-colors shadow-sm"
            >
              <User className="w-5 h-5" />
              My Information
            </button>
          </div>

          {/* Quick Actions */}`;

content = content.replace(quickActionsTarget, newBtn);

fs.writeFileSync('src/components/AiCoachView.tsx', content);
console.log("Patched AiCoachView button");
