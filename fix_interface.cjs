const fs = require('fs');
let app = fs.readFileSync('src/components/PremiumSubscriptionPage.tsx', 'utf8');
app = app.replace(/export default function PremiumSubscriptionPage\(\{ onBack \}: \{ onBack: \(\) => void \}\) \{/, 'export default function PremiumSubscriptionPage({ onBack, onSkip }: { onBack: () => void; onSkip?: () => void }) {');
fs.writeFileSync('src/components/PremiumSubscriptionPage.tsx', app);
