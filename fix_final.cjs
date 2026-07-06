const fs = require('fs');

let app = fs.readFileSync('src/components/PremiumSubscriptionPage.tsx', 'utf8');
app = app.replace(/interface PremiumSubscriptionPageProps \{/, 'interface PremiumSubscriptionPageProps { onSkip?: () => void;');
fs.writeFileSync('src/components/PremiumSubscriptionPage.tsx', app);

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
i18n = i18n.replace(/translations\.kn = translations\.en;/g, '');
fs.writeFileSync('src/i18n.ts', i18n);

