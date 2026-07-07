const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find the slide to remove
  // In src/features/onboarding/components/OnboardingScreens.tsx it starts with:
  //    },
  //    {
  //      buttonText: "Next",
  //      content: (
  //        <div className="flex flex-col items-center w-full text-center">
  //          <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">
  //            LEAGUES & <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">RANKS</span>

  const regex1 = /    \},\n    \{\n      buttonText: "Next",\n      content: \(\n        <div className="flex flex-col items-center w-full text-center">\n          <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">\n            LEAGUES & <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">RANKS<\/span>[\s\S]*?      \)\n    \}/;

  content = content.replace(regex1, "    }");

  // In src/components/OnboardingScreens.tsx it starts with:
  //    },
  //    {
  //      title: "LEAGUES AND RANKS",

  const regex2 = /    \},\n    \{\n      title: "LEAGUES AND RANKS",[\s\S]*?      \)\n    \}/;

  content = content.replace(regex2, "    }");

  // Ensure map array is correct
  content = content.replace(/\[0, 1, 2\]/g, "[0, 1]");
  content = content.replace(/currentSlide < 2/g, "currentSlide < 1");
  content = content.replace(/currentSlide === 2/g, "currentSlide === 1");

  fs.writeFileSync(file, content);
}

patchFile('src/features/onboarding/components/OnboardingScreens.tsx');
patchFile('src/components/OnboardingScreens.tsx');
