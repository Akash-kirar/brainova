const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const badBtn = `<button 
                            onClick={() => setIsPlanGeneratorOpen(false)}
                            className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg transition-colors mt-4"
                          >
                            {t('startTraining', language)}
                          </button>`;

content = content.replace(badBtn, '');

fs.writeFileSync('src/App.tsx', content);
console.log("Removed Start Training btn");
