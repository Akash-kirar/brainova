const fs = require('fs');

let content = fs.readFileSync('src/features/auth/components/AuthScreen.tsx', 'utf8');

const imports = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mail, Lock, User, Brain, Github } from 'lucide-react';
import { Language, t } from '@/src/i18n';
import { supabase } from '@/src/lib/supabase';`;

content = content.replace(/import React.*?from '@\/src\/i18n';/s, imports);

const loginReplace = `
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailLogin = async () => {
    if (!supabase) {
       onLogin(email.split('@')[0]);
       return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', data.user.id).single();
      onLogin(profile?.name || email.split('@')[0]);
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async () => {
    if (!supabase) {
       onLogin(signupName || email.split('@')[0]);
       return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: signupName
          }
        }
      });
      if (error) throw error;
      
      if (data.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, name: signupName });
      }
      onLogin(signupName || email.split('@')[0]);
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };
`;

content = content.replace(/const \[signupName, setSignupName\] = useState\(''\);/, "const [signupName, setSignupName] = useState('');" + loginReplace);

const emailInputTarget = `<input 
                    type="email" 
                    placeholder={t('emailAddress', language) || "Email address"} 
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />`;

content = content.replace(emailInputTarget, `<input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailAddress', language) || "Email address"} 
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />`);
content = content.replace(emailInputTarget, `<input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailAddress', language) || "Email address"} 
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />`);

const passwordInputTarget = `<input 
                    type="password" 
                    placeholder={t('password', language) || "Password"} 
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />`;

content = content.replace(passwordInputTarget, `<input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password', language) || "Password"} 
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />`);
content = content.replace(passwordInputTarget, `<input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password', language) || "Password"} 
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />`);

const loginBtnTarget = `<button 
                onClick={() => onLogin(signupName)}
                className="w-full h-14 rounded-2xl bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-600 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                {t('logIn', language) || "Log In"}
              </button>`;

content = content.replace(loginBtnTarget, `{errorMsg && <div className="text-red-400 text-sm mb-4">{errorMsg}</div>}
              <button 
                onClick={handleEmailLogin}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-600 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
              >
                {loading ? 'Loading...' : (t('logIn', language) || "Log In")}
              </button>`);

const signupBtnTarget = `<button 
                onClick={() => onLogin(signupName)}
                className="w-full h-14 rounded-2xl bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-600 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                {t('signUp', language) || "Sign up"}
              </button>`;

content = content.replace(signupBtnTarget, `{errorMsg && <div className="text-red-400 text-sm mb-4">{errorMsg}</div>}
              <button 
                onClick={handleEmailSignup}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-600 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
              >
                {loading ? 'Loading...' : (t('signUp', language) || "Sign up")}
              </button>`);

fs.writeFileSync('src/features/auth/components/AuthScreen.tsx', content);
console.log('patched auth screen');
