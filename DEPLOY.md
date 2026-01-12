# 🚀 Deploy to Vercel - Quick Guide

## Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Click "Deploy"**

5. **Set up Vercel KV Database** (Important!):
   - After deployment, go to your project dashboard
   - Click on **"Storage"** tab
   - Click **"Create Database"**
   - Select **"KV"** (Redis)
   - Create the database
   - Vercel will automatically add these environment variables:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`

6. **Redeploy**:
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**

## Method 2: Deploy via Vercel CLI

If you prefer CLI (after fixing certificate issues):

```bash
# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? digital-scrapbook (or your choice)
# - Directory? ./
# - Override settings? N
```

Then set up Vercel KV as described in Method 1, step 5.

## After Deployment

1. Your app will be live at: `https://your-project-name.vercel.app`
2. Share the link: `https://your-project-name.vercel.app/share`
3. View dashboard: `https://your-project-name.vercel.app`

## Important Notes

- ✅ The app automatically uses Vercel KV when deployed (if configured)
- ✅ Local development still uses file-based storage
- ✅ Free tier includes 256MB KV storage and 30K operations/day
- ✅ All notes are stored in Vercel KV in production

## Troubleshooting

If notes aren't saving:
1. Check that Vercel KV is set up in your project
2. Verify environment variables are present in Vercel dashboard
3. Check deployment logs for errors

