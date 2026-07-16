const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const handleNameSave = () => {
    if (tempName.trim()) {
      setProfileName(tempName.trim());
    }
    setProfileEmail(tempEmail.trim());
    setIsEditNameOpen(false);
  };`;

const replacement = `  const handleNameSave = async () => {
    if (tempName.trim()) {
      const newName = tempName.trim();
      setProfileName(newName);
      
      if (supabase) {
         const { data: { session } } = await supabase.auth.getSession();
         if (session) {
           await supabase.from('profiles').upsert({ id: session.user.id, name: newName });
         }
      }
    }
    setProfileEmail(tempEmail.trim());
    setIsEditNameOpen(false);
  };`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log('patched handleNameSave');
