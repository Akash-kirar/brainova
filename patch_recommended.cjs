const fs = require('fs');
let content = fs.readFileSync('src/components/RecommendedTraining.tsx', 'utf8');

const targetStr = `              <div className="text-left">
                <h4 className="font-bold text-[18px] text-white tracking-tight mb-0.5">{item.name}</h4>
                <p className="text-[14px] text-white/50">{item.category}</p>
              </div>
            </div>`;

const replaceStr = `              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[18px] text-white tracking-tight mb-0.5">{item.name}</h4>
                  {item.gameId === 'sudoku-lite' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f59e0b]">
                      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
                    </svg>
                  )}
                </div>
                <p className="text-[14px] text-white/50">{item.category}</p>
              </div>
            </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/RecommendedTraining.tsx', content);
  console.log('patched recommended');
} else {
  console.log('not found');
}
