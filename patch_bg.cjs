const fs = require('fs');
let content = fs.readFileSync('src/components/AiAnalysisPage.tsx', 'utf8');

const targetStr = `        {/* Radar Chart Card */}
        <div className="bg-[#121217] border border-white/5 rounded-3xl p-6 pt-8 flex flex-col items-center">
          <h2 className="text-[17px] font-bold text-white mb-1 tracking-tight">Your Cognitive Overview</h2>
          <p className="text-[13px] text-white/50 mb-8 font-medium">Updated today</p>
          
          <div className="w-full h-[380px]">`;

const replaceStr = `        {/* Radar Chart Card */}
        <div className="pt-2 pb-6 flex flex-col items-center">
          <h2 className="text-[17px] font-bold text-white mb-1 tracking-tight">Your Cognitive Overview</h2>
          <p className="text-[13px] text-white/50 mb-4 font-medium">Updated today</p>
          
          <div className="w-full h-[450px]">`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/AiAnalysisPage.tsx', content);
  console.log('patched chart bg');
} else {
  console.log('target not found for chart bg');
}
