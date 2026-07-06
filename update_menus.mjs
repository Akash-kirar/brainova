import fs from 'fs';
import path from 'path';

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

  if (content.includes('key="menu"') && content.includes('<motion.div')) {

    const iconMatch = content.match(/<([A-Z][a-zA-Z0-9]+)\s+className="w-1[246] h-1[246] text-([a-z]+-\d+)"/);
    if (!iconMatch) continue;
    const iconName = iconMatch[1];
    const colorClass = iconMatch[2];

    let titleMatch = content.match(/<h2 className="[^"]*font-bold[^"]*">([^<]+)<\/h2>/);
    if (!titleMatch) titleMatch = ["", "Brain Training"];
    const title = titleMatch[1];

    let descMatch = content.match(/<p className="[^"]*text-white\/(?:50|60)[^"]*">([\s\S]*?)<\/p>/);
    if (!descMatch) descMatch = ["", "Train your brain with this exercise."];
    const desc = descMatch[1].trim();

    if (!content.includes("GameMenu")) {
      content = content.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1 } from 'lucide-react';\nimport GameMenu from './GameMenu';");
    }

    const takesDiff = content.includes('startGame(diff)') || content.includes(`startGame('medium')`);

    // Only non-greedy match to avoid deleting the rest of the game
    const regex = /<motion\.div key="menu"[\s\S]*?<\/motion\.div>/;

    const replacement = `<GameMenu
              title="${title}"
              description="${desc.replace(/\n/g, ' ')}"
              icon={<${iconName} className="w-14 h-14 text-${colorClass}" />}
              iconBgColor="bg-${colorClass.replace('-400', '-500')}/20"
              iconColor="text-${colorClass}"
              onStart={startGame}
              showDifficulty={${takesDiff ? 'true' : 'false'}}
            />`;

    const nextContent = content.replace(regex, replacement);
    if (nextContent !== content) {
      fs.writeFileSync(file, nextContent);
      console.log(`Updated ${file}`);
      updatedCount++;
    }
  }
}

console.log(`Updated ${updatedCount} files.`);
