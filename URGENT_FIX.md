# 🚨 URGENT FIX - Server Error Issue

## Problem
Form submission showing "Server error. Please try again later."

## Most Likely Cause
**MongoDB not connected** OR **Environment variables missing in Vercel**

---

## SOLUTION - Follow These Steps:

### Step 1: Check What's Wrong

Open this URL in browser:
```
https://store-backend-nine-opal.vercel.app/api/health
```

You'll see something like this:
```json
{
  "mongodb": {
    "connected": false,  ← If this is false, MongoDB issue
    "state": "disconnected"
  },
  "environment": {
    "hasMongoUri": false,  ← If this is false, env var missing
    "hasEmailUser": true,
    "hasEmailPass": true
  }
}
```

---

### Step 2A: If `hasMongoUri: false`

**Environment variables are missing in Vercel!**

#### Fix:
1. Go to https://vercel.com
2. Select project: **store-backend**
3. Click **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Where to Get |
|------|-------|--------------|
| `MONGODB_URI` | `mongodb+srv://...` | From your `.env` file or MongoDB Atlas |
| `EMAIL_USER` | `your-email@gmail.com` | Your Gmail |
| `EMAIL_PASS` | `app-password` | Gmail App Password |
| `FRONTEND_URL` | `https://store-space-pr3899.vercel.app` | Your frontend URL |

5. For each variable:
   - Click **Add New**
   - Enter Name and Value
   - Select **Production**, **Preview**, **Development** (all three)
   - Click **Save**

6. After adding all variables, click **Redeploy**:
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Click **Redeploy**

---

### Step 2B: If `mongodb.connected: false`

**MongoDB IP whitelist issue!**

#### Fix:
1. Go to https://cloud.mongodb.com
2. Click on your cluster
3. Click **Network Access** (left sidebar)
4. Check if `0.0.0.0/0` is in the list
5. If NOT there:
   - Click **Add IP Address**
   - Click **Allow Access from Anywhere**
   - Click **Confirm**

6. Wait 2-3 minutes for changes to apply

7. Redeploy in Vercel:
   - Vercel Dashboard → Deployments
   - Click **...** → **Redeploy**

---

### Step 3: Verify Fix

After redeploying, check again:
```
https://store-backend-nine-opal.vercel.app/api/health
```

Should now show:
```json
{
  "mongodb": {
    "connected": true,  ← Should be true
    "state": "connected"
  },
  "environment": {
    "hasMongoUri": true,  ← Should be true
    "hasEmailUser": true,
    "hasEmailPass": true
  }
}
```

---

### Step 4: Test Form

1. Go to your frontend
2. Fill the form
3. Submit
4. Should work now! ✅

---

## Quick Reference

### Your MongoDB URI Format:
```
mongodb+srv://username:password@cluster.mongodb.net/feedbackDB?retryWrites=true&w=majority
```

### Your Current Setup:
- **Database**: `feedbackDB`
- **User**: `aryankaushik541_db_user`
- **Cluster**: `cluster0.cikdgjg.mongodb.net`

### Gmail App Password:
1. Google Account → Security
2. 2-Step Verification (enable if not enabled)
3. App Passwords
4. Generate new password
5. Use this in `EMAIL_PASS`

---

## Still Not Working?

### Check Vercel Logs:
1. Vercel Dashboard → Your Project
2. **Deployments** → Latest
3. **Functions** tab
4. Click on `server.js`
5. Look for errors in logs

### Common Log Messages:

**Good:**
```
✅ MongoDB connected successfully
✅ Server running on port 5000
```

**Bad:**
```
❌ MongoDB connection error: ...
❌ MONGODB_URI is not defined
```

---

## Contact Info

If still having issues, share:
1. `/api/health` response
2. Screenshot of Vercel environment variables (hide passwords)
3. Screenshot of MongoDB Network Access page

---

## Summary

**90% of cases:** Missing environment variables in Vercel
**10% of cases:** MongoDB IP whitelist not configured

**Fix:** Add env vars → Redeploy → Should work! 🎉
