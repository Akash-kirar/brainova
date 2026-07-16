const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Top header
content = content.replace(
  `className="flex items-center gap-2 bg-[#fbbf24]/10 border border-[#fbbf24]/30 px-3 py-1.5 rounded-full hover:bg-[#fbbf24]/20 transition-colors cursor-pointer"`,
  `className="flex items-center gap-2 bg-[#c084fc]/10 border border-[#c084fc]/30 px-3 py-1.5 rounded-full hover:bg-[#c084fc]/20 transition-colors cursor-pointer"`
);

content = content.replace(
  `<img src="/logo.png" alt="Brainova" className="w-4 h-4 brightness-0" style={{ filter: 'invert(75%) sepia(85%) saturate(718%) hue-rotate(352deg) brightness(101%) contrast(106%)' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />\n                          <Brain className="w-4 h-4 text-[#fbbf24] hidden" />`,
  `<img src="/logo.png" alt="Brainova" className="w-4 h-4 brightness-0" style={{ filter: 'invert(64%) sepia(51%) saturate(2371%) hue-rotate(227deg) brightness(101%) contrast(97%)' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />\n                          <Brain className="w-4 h-4 text-[#c084fc] hidden" />`
);

content = content.replace(
  `<span className="text-[#fbbf24] font-bold text-sm">{stats.novaCoins || 0}</span>`,
  `<span className="text-[#c084fc] font-bold text-[15px]">{stats.novaCoins || 0}</span>`
);

// Roadmap stats
content = content.replace(
  `<div className="flex items-center justify-center mb-1.5 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">`,
  `<div className="flex items-center justify-center mb-1.5 drop-shadow-[0_0_8px_rgba(192,132,252,0.3)]">`
);

content = content.replace(
  `<img src="/logo.png" alt="Brainova" className="w-6 h-6 brightness-0" style={{ filter: 'invert(75%) sepia(85%) saturate(718%) hue-rotate(352deg) brightness(101%) contrast(106%)' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />\n                          <Brain className="w-6 h-6 text-[#fbbf24] hidden" />`,
  `<img src="/logo.png" alt="Brainova" className="w-6 h-6 brightness-0" style={{ filter: 'invert(64%) sepia(51%) saturate(2371%) hue-rotate(227deg) brightness(101%) contrast(97%)' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />\n                          <Brain className="w-6 h-6 text-[#c084fc] hidden" />`
);

content = content.replace(
  `<span className="text-[24px] text-[#fbbf24] font-bold leading-none" style={{ textShadow: '0 0 10px rgba(251,191,36,0.5)' }}>{stats.novaCoins || 0}</span>`,
  `<span className="text-[24px] text-[#c084fc] font-bold leading-none" style={{ textShadow: '0 0 10px rgba(192,132,252,0.5)' }}>{stats.novaCoins || 0}</span>`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Purple brain logo patched.");
