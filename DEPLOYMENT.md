# Deployment to Vercel

## Quick Deploy

### Option 1: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI globally:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts to link your project.

### Option 2: Deploy via GitHub

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and deploy

## Setting up Vercel KV (Database)

Since Vercel uses serverless functions, file-based storage won't work. You need to set up Vercel KV:

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create Database** → Select **KV**
3. Create a new KV database
4. Vercel will automatically add the environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

5. Redeploy your application

## Environment Variables

The app will automatically use Vercel KV if these environment variables are present:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

If not available, it will fall back to in-memory storage (data resets on each deployment).

## Local Development

For local development, the app uses file-based storage in the `data/` directory. This works fine for testing locally.

## Notes

- The app is configured to work both locally (file storage) and on Vercel (KV storage)
- Make sure to set up Vercel KV in production for persistent storage
- The free tier of Vercel KV includes 256MB storage and 30K reads/writes per day

