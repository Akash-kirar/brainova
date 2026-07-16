const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const feedbackRenderStr = `
  if (isFeedbackOpen) {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] font-sans text-white relative overflow-hidden" style={getModeStyles()}>
        <FeedbackPage onBack={() => setIsFeedbackOpen(false)} language={language} />
      </div>
    );
  }
`;

app = app.replace("  if (isAchievementsOpen) {", feedbackRenderStr + "\n  if (isAchievementsOpen) {");

fs.writeFileSync('src/App.tsx', app);
