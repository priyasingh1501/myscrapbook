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

5. **Set up Supabase Database** (Important!):
   
   a. **Create Supabase Account**:
      - Go to [supabase.com](https://supabase.com)
      - Sign up for free (or sign in)
      - Click **"New Project"**
      - Choose a name, database password, and region
      - Wait for project to be created (takes ~2 minutes)
   
   b. **Create the Notes Table**:
      - In your Supabase project, go to **"SQL Editor"**
      - Click **"New Query"**
      - Copy and paste the SQL from `supabase-setup.sql` file
      - Click **"Run"** to execute
   
   c. **Get Your API Keys**:
      - Go to **"Settings"** → **"API"**
      - Copy your **Project URL** (this is `NEXT_PUBLIC_SUPABASE_URL`)
      - Copy your **anon/public key** (this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   
   d. **Add Environment Variables to Vercel**:
      - Go back to your Vercel project dashboard
      - Go to **"Settings"** → **"Environment Variables"**
      - Add these two variables:
        - `NEXT_PUBLIC_SUPABASE_URL` = (your Supabase project URL)
        - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your Supabase anon key)
      - Make sure to select all environments (Production, Preview, Development)

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

- ✅ The app automatically uses Supabase when environment variables are set
- ✅ Local development uses file-based storage (or Supabase if env vars are set)
- ✅ Supabase free tier includes 500MB database storage
- ✅ All notes are stored in Supabase in production
- ✅ You need to run the SQL migration once to create the `notes` table

## Troubleshooting

If notes aren't saving:
1. Check that Supabase is set up and the `notes` table exists
2. Verify both environment variables are set in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Make sure you ran the SQL migration in Supabase SQL Editor
4. Check Vercel deployment logs for errors
5. Check Supabase logs in your project dashboard

