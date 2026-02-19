# 🔍 Debug Steps - "Server Error" Issue

## Step 1: Check API Health

Open this URL in your browser:
```
https://store-backend-nine-opal.vercel.app/api/health
```

### What to Look For:

**✅ Good Response:**
```json
{
  "status": "ok",
  "mongodb": {
    "connected": true,
    "state": "connected"
  },
  "environment": {
    "hasMongoUri": true,
    "hasEmailUser": true,
    "hasEmailPass": true
  }
}
```

**❌ Bad Response:**
```json
{
  "mongodb": {
    "connected": false,
    "state": "disconnected"
  }
}
```

## Step 2: Check Environment Variables

### Go to Vercel Dashboard:
1. Open https://vercel.com
2. Select your project: `store-backend`
3. Go to **Settings** → **Environment Variables**

### Required Variables:

| Variable | Example | Status |
|----------|---------|--------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/db` | ⚠️ CRITICAL |
| `EMAIL_USER` | `your-email@gmail.com` | ⚠️ CRITICAL |
| `EMAIL_PASS` | `your-app-password` | ⚠️ CRITICAL |
| `FRONTEND_URL` | `https://store-space-pr3899.vercel.app` | ⚠️ CRITICAL |

### If Missing:
1. Click **Add New**
2. Enter variable name
3. Enter value
4. Select **Production**, **Preview**, **Development**
5. Click **Save**
6. **Redeploy** the project

## Step 3: Check MongoDB Connection

### MongoDB Atlas Dashboard:
1. Go to https://cloud.mongodb.com
2. Select your cluster
3. Click **Connect**

### Check IP Whitelist:
1. **Network Access** tab
2. Should have: `0.0.0.0/0` (Allow from anywhere)
3. If not, click **Add IP Address** → **Allow Access from Anywhere**

### Check Database User:
1. **Database Access** tab
2. User should have **Read and Write** permissions
3. Password should match the one in `MONGODB_URI`

### Test Connection String:
```bash
# Copy your MONGODB_URI from Vercel
# It should look like:
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Common Issues:**
- ❌ Wrong password
- ❌ Wrong database name
- ❌ IP not whitelisted
- ❌ User doesn't have permissions

## Step 4: Check Vercel Deployment Logs

### View Logs:
1. Vercel Dashboard → Your Project
2. **Deployments** tab
3. Click on latest deployment
4. Click **Functions** tab
5. Click on any function (e.g., `server.js`)
6. View real-time logs

### Look For:
```
✅ MongoDB connected successfully
✅ Server running on port 5000
```

**OR**

```
❌ MongoDB connection error: ...
❌ MONGODB_URI is not defined
```

## Step 5: Test API Directly

### Using Browser:
```
https://store-backend-nine-opal.vercel.app/api/test
```

Should return:
```json
{
  "success": true,
  "message": "API routes are working!"
}
```

### Using cURL:
```bash
curl -X POST https://store-backend-nine-opal.vercel.app/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "mobile": "1234567890",
    "firstName": "Test",
    "lastName": "User",
    "moveInDate": "2024-12-31T00:00:00.000Z"
  }'
```

## Step 6: Common Fixes

### Fix 1: MongoDB Not Connected

**Problem:** `mongodb.connected: false`

**Solution:**
1. Check MongoDB Atlas is running
2. Verify IP whitelist (0.0.0.0/0)
3. Check connection string in Vercel env vars
4. Ensure database user has permissions
5. Redeploy after fixing

### Fix 2: Environment Variables Missing

**Problem:** `hasMongoUri: false`

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Add all required variables
3. Make sure to select all environments (Production, Preview, Development)
4. Click **Redeploy**

### Fix 3: CORS Error

**Problem:** "Access to fetch has been blocked by CORS"

**Solution:**
Already fixed in `server.js`. If still occurring:
1. Check frontend URL is correct
2. Verify CORS config includes your domain
3. Redeploy backend

### Fix 4: Email Configuration

**Problem:** Emails not sending

**Solution:**
1. Gmail → Security → 2-Step Verification (enable)
2. Generate App Password
3. Use app password in `EMAIL_PASS`
4. Update in Vercel env vars
5. Redeploy

## Step 7: Redeploy

After making any changes:

### Option 1: Auto-Deploy (Recommended)
```bash
# Changes are already pushed to GitHub
# Vercel will auto-deploy
```

### Option 2: Manual Redeploy
1. Vercel Dashboard → Deployments
2. Click **...** on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Step 8: Verify Fix

### Test Health Endpoint:
```
https://store-backend-nine-opal.vercel.app/api/health
```

Should show:
```json
{
  "mongodb": {
    "connected": true
  }
}
```

### Test Form Submission:
1. Go to your frontend
2. Fill the form
3. Submit
4. Should see success message

## Quick Checklist

- [ ] `/api/health` shows MongoDB connected
- [ ] All environment variables set in Vercel
- [ ] MongoDB IP whitelist configured (0.0.0.0/0)
- [ ] Database user has read/write permissions
- [ ] Latest deployment successful
- [ ] No errors in Vercel function logs
- [ ] Test endpoint returns success

## Still Not Working?

### Check These URLs:

1. **Health Check:**
   ```
   https://store-backend-nine-opal.vercel.app/api/health
   ```

2. **Test Endpoint:**
   ```
   https://store-backend-nine-opal.vercel.app/api/test
   ```

3. **Main Endpoint:**
   ```
   https://store-backend-nine-opal.vercel.app
   ```

### Get Detailed Error:

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Submit form
4. Click on the failed request
5. Check **Response** tab
6. Copy error message

### Check Vercel Logs:

1. Vercel Dashboard
2. Functions tab
3. Real-time logs
4. Look for error messages

## Most Common Issue

**90% of "Server error" issues are due to:**

1. **MongoDB not connected** (60%)
   - Fix: Check IP whitelist and connection string

2. **Environment variables missing** (30%)
   - Fix: Add all vars in Vercel settings

3. **Deployment not updated** (10%)
   - Fix: Redeploy the project

## Contact Support

If none of these work:

1. Share `/api/health` response
2. Share Vercel function logs
3. Share MongoDB Atlas connection status
4. Share environment variables (without passwords)

---

**Next Step:** Open `/api/health` endpoint and share the response!
