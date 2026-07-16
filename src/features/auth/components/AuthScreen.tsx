import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mail, Lock, User, Brain, Github } from 'lucide-react';
import { Language, t } from '@/src/i18n';
import { supabase } from '@/src/lib/supabase';

interface AuthScreenProps {
  language: Language;
  onLogin: (name?: string) => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ language, onLogin, onBack }) => {
  const [authMode, setAuthMode] = useState<'select' | 'login' | 'signup'>('select');
  const [signupName, setSignupName] = useState('');
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


  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  const InstagramIcon = () => (
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] font-sans text-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col px-8 pt-16 pb-12 overflow-y-auto hide-scrollbar relative z-10 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {authMode === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center h-full justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <Brain className="w-12 h-12 text-indigo-400" />
              </div>
              
              <h2 className="text-4xl font-bold tracking-tight mb-4">{t('welcomeToBrainova', language) || "Welcome to Brainova"}</h2>
              <p className="text-[15px] text-white/60 mb-10 leading-relaxed max-w-[280px]">
                Create an account to save your progress and get personalized cognitive training.
              </p>

              <button 
                onClick={() => setAuthMode('signup')}
                className="w-full h-14 rounded-2xl bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-600 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] mb-4"
              >
                {t('createAccount', language) || "Create Account"}
              </button>

              <button 
                onClick={() => setAuthMode('login')}
                className="w-full h-14 rounded-2xl bg-[#1a1a1c] border border-white/10 text-white font-bold text-lg hover:bg-[#2a2a2c] hover:scale-[0.98] active:scale-95 transition-all mb-8"
              >
                {t('logIn', language) || "Log In"}
              </button>

              <div className="w-full flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Or continue with</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              <div className="w-full flex justify-center gap-4">
                <button 
                  onClick={() => { const name = prompt("Enter your name to simulate fetching profile:") || ''; onLogin(name); }}
                  className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-[0.95] active:scale-90 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <GoogleIcon />
                </button>
                <button 
                  onClick={() => { const name = prompt("Enter your name to simulate fetching profile:") || ''; onLogin(name); }}
                  className="w-14 h-14 rounded-2xl text-white flex items-center justify-center hover:scale-[0.95] active:scale-90 transition-transform shadow-lg"
                  style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                >
                  <InstagramIcon />
                </button>
                <button 
                  onClick={() => { const name = prompt("Enter your name to simulate fetching profile:") || ''; onLogin(name); }}
                  className="w-14 h-14 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center hover:scale-[0.95] active:scale-90 transition-transform shadow-lg"
                >
                  <FacebookIcon />
                </button>
              </div>
            </motion.div>
          )}

          {authMode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full justify-center"
            >
              <button 
                onClick={() => setAuthMode('select')}
                className="w-10 h-10 rounded-full bg-[#1a1a1c] border border-white/5 flex items-center justify-center mb-10 hover:bg-[#2a2a2c] transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <h2 className="text-4xl font-bold mb-3 tracking-tight">{t('welcomeBack', language) || "Welcome Back"}</h2>
              <p className="text-white/60 mb-10 text-[15px]">Log in to continue your training.</p>
              
              <div className="space-y-4 mb-8 w-full">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailAddress', language) || "Email address"} 
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password', language) || "Password"} 
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />
                </div>
              </div>

              <div className="flex justify-end mb-8 w-full">
                <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                  {t('forgotPassword', language) || "Forgot password?"}
                </button>
              </div>

              {errorMsg && <div className="text-red-400 text-sm mb-4">{errorMsg}</div>}
              <button 
                onClick={handleEmailLogin}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-600 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
              >
                {loading ? 'Loading...' : (t('logIn', language) || "Log In")}
              </button>
            </motion.div>
          )}

          {authMode === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full justify-center"
            >
              <button 
                onClick={() => setAuthMode('select')}
                className="w-10 h-10 rounded-full bg-[#1a1a1c] border border-white/5 flex items-center justify-center mb-10 hover:bg-[#2a2a2c] transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <h2 className="text-4xl font-bold mb-3 tracking-tight">{t('createAccount', language) || "Create Account"}</h2>
              <p className="text-white/60 mb-10 text-[15px]">Start your cognitive training journey today.</p>
              
              <div className="space-y-4 mb-10 w-full">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailAddress', language) || "Email address"} 
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password', language) || "Password"} 
                    className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />
                </div>
              </div>

              {errorMsg && <div className="text-red-400 text-sm mb-4">{errorMsg}</div>}
              <button 
                onClick={handleEmailSignup}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-600 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
              >
                {loading ? 'Loading...' : (t('signUp', language) || "Sign up")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
