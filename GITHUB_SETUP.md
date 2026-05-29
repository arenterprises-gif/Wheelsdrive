# GitHub Actions Setup Guide

## 1. Create GitHub Secrets

Go to: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

```
VERCEL_TOKEN
├─ Get from: https://vercel.com/account/tokens
└─ Create a new token with production access

VERCEL_ORG_ID
├─ Get from: vercel.json (already in project)
└─ Or: https://vercel.com/account (Team ID)

VERCEL_PROJECT_ID
├─ Get from: vercel.json (already in project)
└─ Or: https://vercel.com/dashboard (Project ID)

VITE_SUPABASE_URL
├─ Get from: Your Supabase project settings
├─ Format: https://xxx.supabase.co
└─ Keep this exact URL

VITE_SUPABASE_ANON_KEY
├─ Get from: Your Supabase project API keys
├─ Use the "anon/public" key
└─ Never use "service_role" key here
```

## 2. How the Workflow Works

### On Push to main/master (Production)
```
✅ npm ci (install dependencies)
✅ npm run build (TypeScript + Vite bundle)
✅ tsc --noEmit (type checking)
✅ vercel --prod (deploy to production)
```

### On Pull Request (Preview)
```
✅ npm ci
✅ npm run build
✅ vercel (deploy preview URL)
```

## 3. Deploy Workflow

1. **Develop locally:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/wheelsdrive.git
   cd wheelsdrive
   npm install
   npm run dev
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update UI/UX"
   git push origin main
   ```

3. **GitHub Actions runs automatically:**
   - Go to **Actions** tab to see build status
   - Wait for ✅ to complete (3-5 min)

4. **Vercel deployment:**
   - Watch https://vercel.com/dashboard
   - Get live URL once complete

## 4. Troubleshooting

### Build fails with "Cannot find module"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment fails
- Check VERCEL_TOKEN is valid: https://vercel.com/account/tokens
- Check Supabase keys are correct
- Check .env.example exists (optional)

### Preview not updating
- GitHub Actions queued? Check **Actions** tab
- Vercel building? Check https://vercel.com/dashboard
- Need to rerun? Go to Actions → Click workflow → Rerun jobs

## 5. Environment Variables

Create `.env.local` for local development (git ignored):

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

## 6. Vercel Settings

In Vercel dashboard → Project Settings → Environment Variables:
- Already set via GitHub Actions secrets
- Or manually add if needed

## 7. DNS & Domain

1. In Vercel dashboard: **Settings → Domains**
2. Add your custom domain
3. Update DNS records (CNAME or A records)
4. Wait 24-48 hours for propagation

## Production Checklist

- [ ] Supabase database tables created (use Settings SQL setup)
- [ ] Supabase auth enabled
- [ ] WhatsApp number set in Settings
- [ ] Logo URL uploaded
- [ ] Admin user created in Supabase auth
- [ ] All secrets in GitHub added
- [ ] Deploy to production once

---

**Need help?** Check Actions tab for real-time build logs!
