const fs = require('fs');

let content = fs.readFileSync('src/i18n.ts', 'utf8');

const newTranslations = {
  "q1": "What is your age range?",
  "q1o1": "Under 18",
  "q1o2": "18-30",
  "q1o3": "31-50",
  "q1o4": "51+",
  
  "q2": "What is your primary cognitive goal?",
  "q2o1": "Enhance Memory",
  "q2o2": "Improve Focus",
  "q2o3": "Faster Problem Solving",
  "q2o4": "General Brain Health",

  "q3": "Which challenge do you face most often?",
  "q3o1": "Forgetting details",
  "q3o2": "Losing focus",
  "q3o3": "Slow reaction time",
  "q3o4": "Difficulty calculating",

  "q4": "How much time can you dedicate daily?",
  "q4o1": "5-10 mins",
  "q4o2": "15-20 mins",
  "q4o3": "30+ mins",
  "q4o4": "Varies",

  "q5": "When are you most alert and focused?",
  "q5o1": "Morning",
  "q5o2": "Afternoon",
  "q5o3": "Evening",
  "q5o4": "Late Night",

  "q6": "What is your current stress level?",
  "q6o1": "Low",
  "q6o2": "Moderate",
  "q6o3": "High",
  "q6o4": "Very High",

  "q7": "How would you rate your sleep quality?",
  "q7o1": "Excellent",
  "q7o2": "Good",
  "q7o3": "Fair",
  "q7o4": "Poor",

  "q8": "What type of games do you enjoy?",
  "q8o1": "Puzzles & Logic",
  "q8o2": "Fast-paced Action",
  "q8o3": "Word & Language",
  "q8o4": "Strategy",

  "q9": "Are you preparing for a specific event?",
  "q9o1": "Exams / Studies",
  "q9o2": "Important Work",
  "q9o3": "No, just training",
  "q9o4": "Just for fun",

  "q10": "How do you prefer your training pace?",
  "q10o1": "Relaxed & Untimed",
  "q10o2": "Fast & Competitive",
  "q10o3": "Progressive",
  "q10o4": "Mixed Mode"
};

// Replace existing q1-q10 and their options in the english section.
// Actually we can just do string replacements for the english dictionary.

for (const [key, value] of Object.entries(newTranslations)) {
  const regex = new RegExp(`"${key}":\\s*".*?",`, 'g');
  content = content.replace(regex, `"${key}": "${value}",`);
}

fs.writeFileSync('src/i18n.ts', content);
console.log("Updated i18n.ts");
