const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /setGeneratedPlan\(\{\n\s*title: "focusLogicMaster",\n\s*description: "focusLogicDesc",\n\s*games: \[\n\s*allGames\.find\(g => g\.id === 'sudoku'\) \|\| allGames\[0\],\n\s*allGames\.find\(g => g\.id === 'sequence'\) \|\| allGames\[1\],\n\s*allGames\.find\(g => g\.id === 'reaction'\) \|\| allGames\[2\]\n\s*\]\n\s*\}\);/m;

const replacement = `let recTitle = "Cognitive Booster";
                                      let recDesc = "A balanced training plan tailored to your profile and answers.";
                                      let recGames = ['memory-grid', 'reaction', 'sudoku'];
                                      const goal = newAnswers[1];
                                      if (goal === "q2o1") {
                                        recTitle = "Memory Master";
                                        recDesc = "A specialized plan designed to enhance your short-term and working memory.";
                                        recGames = ['memory-grid', 'card-match', 'sequence'];
                                      } else if (goal === "q2o2") {
                                        recTitle = "Focus & Attention";
                                        recDesc = "High-intensity exercises to improve your sustained attention and concentration.";
                                        recGames = ['focus', 'reaction', 'math-drill'];
                                      } else if (goal === "q2o3") {
                                        recTitle = "Logic & Problem Solving";
                                        recDesc = "Advanced puzzles and analytical games to sharpen your logical reasoning.";
                                        recGames = ['sudoku', 'smart', 'sliding-puzzle'];
                                      } else if (goal === "q2o4") {
                                        recTitle = "Overall Brain Health";
                                        recDesc = "A well-rounded routine touching on memory, logic, vocabulary, and speed.";
                                        recGames = ['word-search', 'focus', 'card-match'];
                                      }
                                      
                                      setGeneratedPlan({
                                        title: recTitle,
                                        description: recDesc,
                                        games: recGames.map(id => allGames.find(g => g.id === id) || allGames[0])
                                      });`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
