const fs = require('fs');
let content = fs.readFileSync('src/components/PremiumSubscriptionPage.tsx', 'utf8');

const targetStr = `      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, currency: 'INR' })
      });
      const order = await res.json();

      if (!order.id) {
        alert('Server error');
        return;
      }`;

const replaceStr = `      // If no real Razorpay Key is provided in env, mock the payment for testing
      if (!import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID === 'dummy_id') {
        setTimeout(() => {
          localStorage.setItem("brainova_is_pro", "true");
          alert("Test Mode: Payment successful! You are now a Premium member.");
          onBack();
          window.location.reload();
        }, 1000);
        return;
      }

      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, currency: 'INR' })
      });
      const order = await res.json();

      if (!order.id) {
        alert('Server error');
        return;
      }`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/PremiumSubscriptionPage.tsx', content);
console.log('patched premium page');
