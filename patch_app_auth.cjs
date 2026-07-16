const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const importSupabase = `import { supabase } from '@/src/lib/supabase';`;
if (!content.includes(importSupabase)) {
  content = content.replace(`import { ArrowLeft`, `import { supabase }\nfrom '@/src/lib/supabase';\nimport { ArrowLeft`);
}

const authEffect = `
  useEffect(() => {
    if (!supabase) return;
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        // fetch profile name
        supabase.from('profiles').select('name').eq('id', session.user.id).single().then(({ data }) => {
          if (data && data.name) setProfileName(data.name);
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
`;

// Insert after useState for isLoggedIn
const target = `const [isLoggedIn, setIsLoggedIn] = useState(false);`;
if (!content.includes('supabase.auth.getSession()')) {
  content = content.replace(target, target + '\n' + authEffect);
}

// Add signout function to profile or admin settings if there's a button
// First, let's see where a logout button could be added or if there is one.
fs.writeFileSync('src/App.tsx', content);
console.log('patched app auth');
