const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "onClick={() => {\\n                            setSelectedPlan('1month');\\n                          }}",
  "onClick={() => {\\n                            setSelectedPlan('1month');\\n                            setIsSubscriptionModalOpen(false);\\n                            setIsCheckoutModalOpen(true);\\n                          }}"
);

content = content.replace(
  "onClick={() => {\\n                            setSelectedPlan('6months');\\n                          }}",
  "onClick={() => {\\n                            setSelectedPlan('6months');\\n                            setIsSubscriptionModalOpen(false);\\n                            setIsCheckoutModalOpen(true);\\n                          }}"
);

content = content.replace(
  "onClick={() => {\\n                            setSelectedPlan('1year');\\n                          }}",
  "onClick={() => {\\n                            setSelectedPlan('1year');\\n                            setIsSubscriptionModalOpen(false);\\n                            setIsCheckoutModalOpen(true);\\n                          }}"
);

fs.writeFileSync('src/App.tsx', content);
console.log("Subscription navigation patched.");
