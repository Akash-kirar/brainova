const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('checkout.razorpay.com')) {
  html = html.replace('</head>', '  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>\n</head>');
  fs.writeFileSync('index.html', html);
  console.log('index.html updated');
}
