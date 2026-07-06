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

  // Skip files that don't use GameMenu
  if (!content.includes('GameMenu')) continue;

  // Add onBack to GameMenu
  content = content.replace(/<GameMenu([^>]*(?:[^>]*[\s\S])?)>/, (match, p1) => {
    if (!p1.includes('onBack')) {
      return `<GameMenu${p1} onBack={onBack} >`;
    }
    return match;
  });
  
  if (content !== fs.readFileSync(file, 'utf8')) {
      fs.writeFileSync(file, content);
      updatedCount++;
  }
}
console.log(`Updated ${updatedCount} files.`);
