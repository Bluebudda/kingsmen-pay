# Kingsmen Pay Deployment Guide

## Deploying to Netlify

This guide will walk you through deploying your Kingsmen Pay application to Netlify and connecting it to your custom domain (kingsmenpay.com).

### Prerequisites

1. A GitHub/GitLab/Bitbucket account
2. Access to your domain registrar (where kingsmenpay.com is registered)
3. A Netlify account (free tier is sufficient)

### Step 1: Push Your Code to Git Repository

If you haven't already, push your code to a Git repository:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Kingsmen Pay application"

# Add your remote repository
git remote add origin YOUR_REPOSITORY_URL

# Push to main branch
git push -u origin main
```

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended)

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18
6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify in your project
netlify init

# Deploy
netlify deploy --prod
```

### Step 3: Add Environment Variables

In your Netlify dashboard:

1. Go to Site settings → Environment variables
2. Add the following variables from your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Step 4: Connect Custom Domain

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter `kingsmenpay.com`
4. Netlify will provide DNS records to configure

### Step 5: Configure DNS

Go to your domain registrar and update DNS records:

#### For Root Domain (kingsmenpay.com):

**Option A: Using Netlify DNS (Recommended)**
- Change your nameservers to Netlify's nameservers (provided in Netlify dashboard)

**Option B: Using A Records**
- Add an A record pointing to Netlify's load balancer IP: `75.2.60.5`

#### For WWW Subdomain:
- Add CNAME record: `www.kingsmenpay.com` → `your-site-name.netlify.app`

### Step 6: Enable HTTPS

1. In Netlify dashboard, go to "Domain settings" → "HTTPS"
2. Netlify will automatically provision a Let's Encrypt SSL certificate
3. Enable "Force HTTPS" to redirect all HTTP traffic to HTTPS

### Step 7: Verify Deployment

1. Visit `https://kingsmenpay.com` to verify your site is live
2. Test the link preview on:
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
   - Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Telegram: Share the link in any chat

### Continuous Deployment

Once connected to your Git repository, Netlify will automatically:
- Deploy when you push to your main branch
- Create preview deployments for pull requests
- Run your build command and publish the `dist` directory

### Troubleshooting

#### Build Fails
- Check the build logs in Netlify dashboard
- Verify all dependencies are in `package.json`
- Ensure Node version is set to 18

#### Environment Variables Not Working
- Make sure variables are prefixed with `VITE_`
- Redeploy after adding environment variables

#### Domain Not Resolving
- DNS propagation can take up to 48 hours
- Use `nslookup kingsmenpay.com` to check DNS propagation
- Try clearing your browser cache

#### Link Previews Still Show Old Content
- Use the inspection tools to force a refresh
- Add `?v=1` to the end of URLs to bypass cache
- Wait 24-48 hours for social media caches to expire

## Alternative Hosting Options

### Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Vercel auto-detects Vite configuration
4. Add environment variables
5. Add custom domain in project settings

### AWS Amplify

1. Go to AWS Amplify Console
2. Connect your repository
3. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```
4. Add environment variables
5. Add custom domain

## Post-Deployment Checklist

- [ ] Site is accessible at https://kingsmenpay.com
- [ ] SSL certificate is active (green padlock in browser)
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] Login/authentication works
- [ ] Link previews show correct branding on social media
- [ ] Mobile responsive design works
- [ ] Environment variables are configured

## Support

For deployment issues:
- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://www.netlify.com/support/

For application issues:
- Check application logs in browser console
- Verify Supabase connection
- Test API endpoints
