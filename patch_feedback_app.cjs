const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
app = app.replace(
  "import AchievementsPage from './components/AchievementsPage';",
  "import AchievementsPage from './components/AchievementsPage';\nimport FeedbackPage from './components/FeedbackPage';"
);

// Remove the inline modal
const oldModalStrRegex = /\{\/\* Feedback Modal \*\/\}\s*<AnimatePresence>[\s\S]*?Your feedback has been submitted successfully\.<\/p>\s*<\/motion\.div>\s*\)\}\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/g;
app = app.replace(oldModalStrRegex, '');

// Also remove `feedbackRating` and `feedbackText` and `isFeedbackSubmitted` from App.tsx since we no longer need them there
app = app.replace("const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);", "");
app = app.replace("const [feedbackRating, setFeedbackRating] = useState(0);", "");
app = app.replace("const [feedbackText, setFeedbackText] = useState('');", "");

// Render FeedbackPage if isFeedbackOpen
// Let's find where to put it. 
const renderStr = `
        <AnimatePresence>
          {isFeedbackOpen && (
            <FeedbackPage onBack={() => setIsFeedbackOpen(false)} language={language} />
          )}
        </AnimatePresence>
`;

app = app.replace("{/* Profile Settings Modal */}", renderStr + "\n          {/* Profile Settings Modal */}");

fs.writeFileSync('src/App.tsx', app);
