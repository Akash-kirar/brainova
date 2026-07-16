const fs = require('fs');
let content = fs.readFileSync('src/components/PremiumSubscriptionPage.tsx', 'utf8');

const targetStr = `  const features = [
    { text: 'Unlimited access to all games', icon: <PlayCircle className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Advanced AI analysis', icon: <TrendingUp className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Priority Support', icon: <Headphones className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Early Access to New Features', icon: <Star className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Detailed progress reports', icon: <BarChart2 className="w-[18px] h-[18px] text-[#f59e0b]" /> },
  ];`;

const replaceStr = `  const features = [
    { text: 'Access to all 100+ Premium Games', icon: <PlayCircle className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Advanced AI analysis', icon: <TrendingUp className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Priority Support', icon: <Headphones className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Early Access to New Features', icon: <Star className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Detailed progress reports', icon: <BarChart2 className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Ad-free experience', icon: <Ban className="w-[18px] h-[18px] text-[#f59e0b]" /> },
  ];`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/PremiumSubscriptionPage.tsx', content);
  console.log('patched features');
} else {
  console.log('target not found for features');
}
