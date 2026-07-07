#!/bin/bash
# Remove lines 4331 to 4616 (the if (isCompleted) block)
sed -i '4331,4616d' src/App.tsx

# Insert the new AuthScreen block at line 4331
sed -i '4331i \
  if (isCompleted) {\
    return (\
      <AuthScreen \
        language={language} \
        onLogin={() => setIsLoggedIn(true)} \
        onBack={() => setIsCompleted(false)} \
      />\
    );\
  }' src/App.tsx

# Also, we need to import AuthScreen at the top!
sed -i '30i import { AuthScreen } from "@/src/features/auth/components/AuthScreen";' src/App.tsx

# Change setOnboardingStep(1) to setIsCompleted(true)
sed -i 's/setOnboardingStep(1)/setIsCompleted(true)/g' src/App.tsx
