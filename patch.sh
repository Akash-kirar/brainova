sed -i 's/return \`${greeting}, ${profileName} 👋\`;/return \`${greeting}, ${profileName.split(" ")[0]} 👋\`;/g' src/App.tsx
sed -i 's/onLogin: () => void;/onLogin: (name?: string) => void;/g' src/features/auth/components/AuthScreen.tsx
sed -i 's/onClick={onLogin}/onClick={() => onLogin()}/g' src/features/auth/components/AuthScreen.tsx
sed -i 's/onClick={() => onLogin()}/onClick={() => onLogin(signupName)}/g' src/features/auth/components/AuthScreen.tsx
