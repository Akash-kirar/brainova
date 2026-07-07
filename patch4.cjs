const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/currentSlide < 3/g, "currentSlide < 2");
  content = content.replace(/currentSlide === 3/g, "currentSlide === 2");
  fs.writeFileSync(file, content);
}

patchFile('src/features/onboarding/components/OnboardingScreens.tsx');
patchFile('src/components/OnboardingScreens.tsx');
