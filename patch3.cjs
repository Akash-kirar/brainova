const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const s1 = `  const CategoryScoreCard = ({ title, score, icon: Icon, iconColor, iconBgColor, barColor }: any) => {`;

// We just find where `const getUnlockedCount = () => {` is and remove it up to `const unlockedAchievementsCount = getUnlockedCount();`
// then insert it BEFORE `const CategoryScoreCard = `

let idx = appContent.indexOf('  const getUnlockedCount = () => {');
if (idx > -1) {
    let endIdx = appContent.indexOf('  const unlockedAchievementsCount = getUnlockedCount();', idx);
    endIdx += '  const unlockedAchievementsCount = getUnlockedCount();'.length;
    
    const extracted = appContent.substring(idx, endIdx);
    
    // remove it from the string
    appContent = appContent.substring(0, idx) + appContent.substring(endIdx);
    
    // insert it before CategoryScoreCard
    const catIdx = appContent.indexOf(s1);
    appContent = appContent.substring(0, catIdx) + extracted + '\n' + appContent.substring(catIdx);
    
    fs.writeFileSync('src/App.tsx', appContent);
    console.log("Patched!");
} else {
    console.log("Could not find getUnlockedCount");
}

