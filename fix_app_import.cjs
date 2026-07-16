const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { supabase }')) {
  content = "import { supabase } from '@/src/lib/supabase';\n" + content;
  fs.writeFileSync('src/App.tsx', content);
  console.log('fixed import');
}
