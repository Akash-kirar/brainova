# Brainova Final

Brainova is a Vite React app served by a small Express server. Use a Node web service deployment if you want the AI coach and Razorpay API routes to work.

## Local Setup

1. Install Node.js 20 or newer.
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Create `.env` from `.env.example` and set the required values.
4. Start local development:
   ```bash
   npm run dev
   ```

The local app runs on `http://localhost:3000`.

## Required Environment Variables

Set these in your hosting provider before deploying:

```bash
VITE_SUPABASE_URL=https://erejgwkyxibliiusbekl.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Optional, but needed for full production features:

```bash
GEMINI_API_KEY=your_gemini_server_key
GEMINI_MODEL=gemini-3-flash-preview
VITE_RAZORPAY_KEY_ID=your_razorpay_browser_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=production
```

Do not create `VITE_GEMINI_API_KEY`. Gemini runs through the Express API so the secret is not exposed in the browser bundle.

## Deploy On A Node Host

Recommended platforms: Render, Railway, Fly.io, Heroku, or any host that supports a persistent Node server.

Use these settings:

```bash
Build command: npm ci && npm run build
Start command: npm start
Health check: /healthz
```

The server reads `PORT` from the hosting platform automatically.

## Static Hosting Note

You can deploy the `dist` folder to a static host, but these server routes will not work there:

```text
/api/ai/chat
/api/razorpay/create-order
/api/razorpay/verify-signature
```

Use a Node web service deployment for the complete app.

## Verification

Run before deploying:

```bash
npm run typecheck
npm run build
```
