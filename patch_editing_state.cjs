const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace('const [isMyInfoOpen, setIsMyInfoOpen] = useState(false);', 'const [isMyInfoOpen, setIsMyInfoOpen] = useState(false);\n  const [isEditingProfile, setIsEditingProfile] = useState(false);');

fs.writeFileSync('src/App.tsx', content);
console.log("Patched editing state");
