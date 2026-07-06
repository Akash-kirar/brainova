const fs = require('fs');
let code = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const target = `      {mode === 'suggestions' ? (
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
            <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#a855f7]/30 blur-[50px] rounded-full pointer-events-none"></div>`;

const replacement = `      {mode === 'suggestions' ? (
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
          {/* Hero Card */}
          <div className="mx-6 mt-6 bg-gradient-to-b from-[#1c1333] to-[#120b22] border border-[#a855f7]/30 rounded-[28px] p-6 relative overflow-hidden shadow-[0_10px_40px_rgba(109,40,217,0.2)]">
            <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#a855f7]/30 blur-[50px] rounded-full pointer-events-none"></div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/AiCoachView.tsx', code);
