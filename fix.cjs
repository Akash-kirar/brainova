const fs = require('fs');
const globFiles = (dir, matchExt) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(globFiles(file, matchExt));
    } else { 
      if(file.endsWith(matchExt)) results.push(file);
    }
  });
  return results;
}

const files = globFiles('src/components', '.tsx');
let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('/ onBack={onBack} >')) {
     content = content.replace(/\/ onBack=\{onBack\} >/g, '/>');
     changed = true;
  }

  if (!content.includes('onBack={onBack}') && content.includes('<GameMenu') && content.includes('onStart={startGame}')) {
     content = content.replace(/onStart=\{startGame\}/, 'onStart={startGame}\n              onBack={onBack}');
     changed = true;
  }
  
  if (changed) {
      fs.writeFileSync(file, content);
      updatedCount++;
  }
}
console.log(`Updated ${updatedCount} files.`);
