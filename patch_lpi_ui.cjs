const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('{/* Speed */}');
const endIndex = content.indexOf('</div>', content.indexOf('{/* Math Solving */}')) + 20;

if (startIndex !== -1 && endIndex !== -1) {
  const dynamicLpiUi = `{Object.entries(currentLpi)
                        .filter(([key]) => key !== 'overall')
                        .map(([key, value]) => {
                          const labels = {
                            speed: 'Speed',
                            memory: 'Memory',
                            focus: 'Focus',
                            logic: 'Logic',
                            math: 'Math',
                            language: 'Language & Vocabulary',
                            visual: 'Visual & Spatial',
                            observation: 'Observation',
                            executive: 'Executive Function',
                            creativity: 'Creativity'
                          };
                          return (
                            <div key={key} className="relative">
                              <div className="absolute -left-[25px] top-4 w-6 h-[1px] bg-slate-600/60"></div>
                              <h3 className="text-[13px] font-medium text-slate-300 mb-2">{labels[key] || key}</h3>
                              <div className="flex items-center gap-4">
                                <div className="h-[18px] bg-[#c084fc] rounded-sm shadow-[0_0_12px_rgba(192,132,252,0.3)]" style={{ width: \`\${Math.max(4, (value / 1000) * 100)}%\` }}></div>
                                <span className="text-white font-bold">{value}</span>
                              </div>
                            </div>
                          );
                        })}`;

  let chunkStart = startIndex;
  let chunkEnd = content.indexOf('</div>', content.indexOf('Math Solving', chunkStart)) + 6;
  
  // Find the exact end of the Math Solving block
  const searchStr = '<h3 className="text-[13px] font-medium text-slate-300 mb-2">Math Solving</h3>';
  const mathIndex = content.indexOf(searchStr, startIndex);
  if (mathIndex !== -1) {
     const endOfMathDiv = content.indexOf('</div>', mathIndex);
     const endOfMathDiv2 = content.indexOf('</div>', endOfMathDiv + 6);
     chunkEnd = endOfMathDiv2 + 6;
  }

  content = content.substring(0, chunkStart) + dynamicLpiUi + content.substring(chunkEnd);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched LPI UI");
} else {
  console.log("Could not find LPI UI bounds", startIndex, endIndex);
}
