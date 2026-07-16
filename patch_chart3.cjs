const fs = require('fs');
let content = fs.readFileSync('src/components/AiAnalysisPage.tsx', 'utf8');

const targetStr = `        </div>
      </div>
    </div>
  );
}`;

const replaceStr = `        </div>

        <div className="bg-[#121217] border border-white/5 rounded-2xl p-5 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-[#8b5cf6]" />
            <span className="font-bold text-[#8b5cf6] text-[15px]">Detailed Scores</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col bg-[#1c1c24] p-3 rounded-xl border border-white/5">
                <span className="text-[12px] font-medium text-white/50 mb-1">{item.subject}</span>
                <span className="text-[16px] font-bold text-white flex items-baseline gap-1">
                  {stats.highScores[item.subject.toLowerCase()] || 0}
                  <span className="text-[10px] text-white/40 font-normal">XP</span>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/AiAnalysisPage.tsx', content);
  console.log('patched chart details');
} else {
  console.log('target not found for chart details');
}
