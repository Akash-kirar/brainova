const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetRegex = /(<div className="bg-\[#1a1a1c\] border border-white\/10 rounded-2xl p-6 relative">\s*<div className="flex justify-between items-center mb-4 border-b border-white\/10 pb-2">\s*<h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Personalized Training Profile<\/h3>[\s\S]*?\{Object\.keys\(planAnswers\)\.length === 0 \? \([\s\S]*?\) : \([\s\S]*?<div className="flex flex-col gap-3">[\s\S]*?<\/div>)\s*(<div onClick=\{\(\) => setIsPlanGeneratorOpen\(true\)\} className="mt-6 p-5 bg-gradient-to-br from-indigo-500\/10 to-purple-500\/10 hover:from-indigo-500\/20 hover:to-purple-500\/20 border border-indigo-500\/20 rounded-2xl flex items-start gap-4 cursor-pointer transition-colors">\s*<div className="w-10 h-10 rounded-full bg-indigo-500\/20 flex items-center justify-center shrink-0">\s*<Sparkles className="w-5 h-5 text-indigo-400" \/>\s*<\/div>\s*<div>\s*<h4 className="font-bold text-indigo-300 mb-1">AI Recommendation Active<\/h4>\s*<\/div>\s*<\/div>)\s*(<\/div>\s*\)\}\s*<\/div>)/m;

const match = content.match(targetRegex);
if (match) {
  console.log("Matched the target section.");
  
  // The first part captures up to the start of the <div className="flex flex-col gap-3"> (actually I captured up to the end of that div). Wait, let's write a simpler replace.
} else {
  console.log("Not matched.");
}
