const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /let recTitle = "Cognitive Booster";\n\s*let recDesc = "A balanced training plan tailored to your profile and answers.";\n\s*let recGames = \['memory-grid', 'reaction', 'sudoku'\];\n\s*const goal = newAnswers\[1\];\n\s*if \(goal === "q2o1"\) \{\n\s*recTitle = "Memory Master";\n\s*recDesc = "A specialized plan designed to enhance your short-term and working memory.";\n\s*recGames = \['memory-grid', 'card-match', 'sequence'\];\n\s*\} else if \(goal === "q2o2"\) \{\n\s*recTitle = "Focus & Attention";\n\s*recDesc = "High-intensity exercises to improve your sustained attention and concentration.";\n\s*recGames = \['focus', 'reaction', 'math-drill'\];\n\s*\} else if \(goal === "q2o3"\) \{\n\s*recTitle = "Logic & Problem Solving";\n\s*recDesc = "Advanced puzzles and analytical games to sharpen your logical reasoning.";\n\s*recGames = \['sudoku', 'smart', 'sliding-puzzle'\];\n\s*\} else if \(goal === "q2o4"\) \{\n\s*recTitle = "Overall Brain Health";\n\s*recDesc = "A well-rounded routine touching on memory, logic, vocabulary, and speed.";\n\s*recGames = \['word-search', 'focus', 'card-match'\];\n\s*\}/g;

const replacement = `let recTitle = "Cognitive Booster";
                                      let recDesc = "A balanced training plan tailored to your profile and answers.";
                                      let recGames = ['memory-grid', 'reaction-tap', 'sudoku-lite'];
                                      const goal = newAnswers[1];
                                      if (goal === "q2o1") {
                                        recTitle = "Memory Master";
                                        recDesc = "A specialized plan designed to enhance your short-term and working memory.";
                                        recGames = ['memory-grid', 'card-match', 'sequence-recall'];
                                      } else if (goal === "q2o2") {
                                        recTitle = "Focus & Attention";
                                        recDesc = "High-intensity exercises to improve your sustained attention and concentration.";
                                        recGames = ['focus-tap', 'reaction-tap', 'math-sprint'];
                                      } else if (goal === "q2o3") {
                                        recTitle = "Logic & Problem Solving";
                                        recDesc = "Advanced puzzles and analytical games to sharpen your logical reasoning.";
                                        recGames = ['sudoku-lite', 'smart-grid', 'sliding-puzzle'];
                                      } else if (goal === "q2o4") {
                                        recTitle = "Overall Brain Health";
                                        recDesc = "A well-rounded routine touching on memory, logic, vocabulary, and speed.";
                                        recGames = ['word-builder', 'focus-tap', 'card-match'];
                                      }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
