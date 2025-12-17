# GitHub Actions Cron Job Setup Guide

This guide will help you set up a GitHub Actions cron job to automatically publish scheduled posts.

## Prerequisites

- Your app is deployed (Vercel, Railway, or any hosting platform)
- You have access to your GitHub repository
- You know your production URL (e.g., `https://your-app.vercel.app` or `https://yourdomain.com`)

---

## Step 1: Generate a Secure CRON_SECRET

Generate a random secret key. You can use one of these methods:

### Option A: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option B: Using OpenSSL
```bash
openssl rand -hex 32
```

### Option C: Using Online Generator
Visit: https://randomkeygen.com/ and use a "CodeIgniter Encryption Keys" (256-bit)

**Save this secret key** - you'll need it in the next steps!

---

## Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Add `CRON_SECRET`:
- **Name**: `CRON_SECRET`
- **Value**: Paste the secret key you generated in Step 1
- Click **Add secret**

### Add `CRON_ENDPOINT`:
- **Name**: `CRON_ENDPOINT`
- **Value**: Your production URL + endpoint path
  - Example: `https://your-app.vercel.app/api/cron/publish-scheduled-posts`
  - Example: `https://yourdomain.com/api/cron/publish-scheduled-posts`
- Click **Add secret**

---

## Step 3: Add CRON_SECRET to Your Deployment Environment

You need to add `CRON_SECRET` to your hosting platform so your API endpoint can verify requests.

### If using Vercel:

1. Go to your Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key**: `CRON_SECRET`
   - **Value**: Same secret key from Step 1
   - **Environment**: Production (and Preview if you want to test)
6. Click **Save**
7. **Redeploy** your application (important!)

### If using Railway:

1. Go to your Railway project
2. Click on your service
3. Go to **Variables** tab
4. Click **New Variable**
5. Add:
   - **Key**: `CRON_SECRET`
   - **Value**: Same secret key from Step 1
6. Click **Add**

### If using other platforms:

Add `CRON_SECRET` as an environment variable with the same value you used in GitHub Secrets.

---

## Step 4: Verify the Setup

### Test the Endpoint Manually:

Replace `YOUR_SECRET` and `YOUR_URL` with your actual values:

```bash
curl -H "Authorization: Bearer YOUR_SECRET" \
  https://your-app.vercel.app/api/cron/publish-scheduled-posts
```

**Expected Response:**
```json
{
  "message": "No posts to publish",
  "count": 0
}
```

Or if there are posts:
```json
{
  "message": "Successfully published 2 posts",
  "count": 2,
  "posts": [...]
}
```

**If you get `401 Unauthorized`:**
- Check that `CRON_SECRET` matches in both GitHub Secrets and your deployment environment
- Make sure you redeployed after adding the environment variable

---

## Step 5: Test GitHub Actions Workflow

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see "Publish Scheduled Posts" workflow
4. Click **Run workflow** → **Run workflow** (manual trigger)
5. Wait for it to complete
6. Check the logs to see if it succeeded

---

## How It Works

- **GitHub Actions** runs the workflow every 5 minutes (configurable)
- The workflow calls your production API endpoint: `/api/cron/publish-scheduled-posts`
- Your API endpoint verifies the `Authorization` header matches `CRON_SECRET`
- If valid, it finds scheduled posts where `published_at <= NOW()` and publishes them

---

## Customizing the Schedule

Edit `.github/workflows/publish-scheduled-posts.yml` to change the frequency:

```yaml
schedule:
  - cron: "*/1 * * * *"  # Every 1 minute
  - cron: "*/5 * * * *"  # Every 5 minutes (current)
  - cron: "*/10 * * * *" # Every 10 minutes
  - cron: "0 * * * *"    # Every hour
```

**Note:** GitHub Actions cron jobs may have slight delays (1-2 minutes). For more precise timing, consider using Vercel Cron (if on Vercel) or Supabase pg_cron.

---

## Troubleshooting

### Workflow fails with "Unauthorized"
- ✅ Verify `CRON_SECRET` in GitHub Secrets matches your deployment environment
- ✅ Make sure you redeployed after adding the environment variable
- ✅ Check that the endpoint URL in `CRON_ENDPOINT` is correct

### Workflow runs but posts don't publish
- ✅ Check your API endpoint logs (Vercel logs, Railway logs, etc.)
- ✅ Verify scheduled posts exist: `SELECT * FROM posts WHERE status = 'scheduled' AND published_at <= NOW();`
- ✅ Check database connection in your API endpoint

### Workflow doesn't run automatically
- ✅ GitHub Actions cron jobs only run if the repository has been active (pushed to) in the last 60 days
- ✅ Manual triggers always work via "Run workflow" button

---

## Monitoring

### Check Workflow Runs:
- GitHub → Actions → "Publish Scheduled Posts" → See run history

### Check Published Posts:
```sql
-- In Supabase SQL Editor
SELECT id, title, status, published_at, created_at
FROM posts 
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 10;
```

---

## Security Notes

- ✅ Never commit `CRON_SECRET` to your repository
- ✅ Use different secrets for development and production
- ✅ Rotate secrets periodically (every 6-12 months)
- ✅ The secret should be at least 32 characters long

---

## Current Status

✅ GitHub Actions workflow created (`.github/workflows/publish-scheduled-posts.yml`)
✅ API endpoint ready (`/api/cron/publish-scheduled-posts`)
⏳ **Next Steps:**
1. Generate `CRON_SECRET` (Step 1)
2. Add secrets to GitHub (Step 2)
3. Add `CRON_SECRET` to deployment environment (Step 3)
4. Test manually (Step 4)
5. Test GitHub Actions workflow (Step 5)

Once completed, your scheduled posts will automatically publish! 🎉

