const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const regex1 = /\{ code: 'te-IN', name: 'తెలుగు \(Telugu\)' \}/g;
const replace1 = `{ code: 'te-IN', name: 'తెలుగు (Telugu)' },
                        { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
                        { code: 'ta-IN', name: 'தமிழ் (Tamil)' }`;
content = content.replace(regex1, replace1);

fs.writeFileSync('src/components/AiCoachView.tsx', content);
