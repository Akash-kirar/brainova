import fs from 'fs';

function globFiles(dir, matchExt) {
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

  if (content.includes('/ onBack={onBack} >')) {
     content = content.replace(/\/ onBack=\{onBack\} >/g, '/>');
  }

  // Safely insert onBack={onBack} right before the closing GameMenu bracket
  // The structure is usually:
  // <GameMenu
  //   title="..."
  //   ...
  // />
  // We can find <GameMenu and then find its corresponding /> avoiding the icon's />
  // Actually, we can just replace `onStart={startGame}` with `onStart={startGame}\n              onBack={onBack}` since `onStart={startGame}` is reliably present.
  
  if (!content.includes('onBack={onBack}') && content.includes('<GameMenu') && content.includes('onStart={startGame}')) {
     content = content.replace(/onStart=\{startGame\}/, 'onStart={startGame}\n              onBack={onBack}');
  }
  
  if (content !== fs.readFileSync(file, 'utf8')) {
      fs.writeFileSync(file, content);
      updatedCount++;
  }
}
console.log(`Updated ${updatedCount} files.`);
