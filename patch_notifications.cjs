const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldRegex = /const MOCK_NOTIFICATIONS = \[\s*\{ id: '1', title: 'Welcome to Brainova!', message: 'Start your journey with a daily workout.', time: '2h ago', isRead: false \},\s*\];/;

const replacement = `const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Welcome to Brainova!', message: 'Start your cognitive journey with us. Explore personalized workouts, diverse mini-games, and track your daily progress to enhance your brain health.', time: '2m ago', isRead: false },
  { id: '2', title: 'Achievement Unlocked: Early Bird', message: 'Congratulations! You have completed a workout before 8 AM. Keep up the great morning routines to stay sharp all day.', time: '1h ago', isRead: false },
  { id: '3', title: 'New Rank: Focus Novice', message: 'You have reached a new rank! Your focus and attention span are improving. Keep playing Focus games to reach the next tier.', time: '1d ago', isRead: true },
  { id: '4', title: 'Daily Streak Maintained', message: 'Awesome job maintaining your 3-day streak! Consistency is the key to cognitive improvement.', time: '2d ago', isRead: true },
];`;

if (oldRegex.test(content)) {
  content = content.replace(oldRegex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Success");
} else {
  console.log("Failed to match regex");
}
