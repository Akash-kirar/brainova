const fs = require('fs');
let code = fs.readFileSync('src/components/PremiumSubscriptionPage.tsx', 'utf8');
code = code.replace(
  "export default function PremiumSubscriptionPage({ onBack, onSkip }: { onBack: () => void; onSkip?: () => void }) {",
  "export default function PremiumSubscriptionPage({ onBack, onSkip, onSuccess }: { onBack: () => void; onSkip?: () => void; onSuccess?: () => void; }) {"
);
code = code.replaceAll("window.location.reload();", "if (onSuccess) onSuccess();");
fs.writeFileSync('src/components/PremiumSubscriptionPage.tsx', code);
