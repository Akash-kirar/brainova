const fs = require('fs');
let code = fs.readFileSync('src/components/PremiumSubscriptionPage.tsx', 'utf8');
code = code.replace(
  "const handlePayment = async () => {",
  `const handlePayment = async () => {
    // For demo purposes, allow instant unlock if no real razorpay keys are present
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID === 'dummy') {
      localStorage.setItem("brainova_is_pro", "true");
      alert("Payment successful! You are now a Premium member. (Demo Mode)");
      onBack();
      window.location.reload();
      return;
    }`
);
fs.writeFileSync('src/components/PremiumSubscriptionPage.tsx', code);
