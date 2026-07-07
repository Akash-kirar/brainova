sed -i "s/onLogin={(name) => { if(name) setProfileName(name); setIsLoggedIn(true); }}/onLogin={(name) => { if(name) setProfileName(name); setOnboardingStep(1); }}/" src/App.tsx
