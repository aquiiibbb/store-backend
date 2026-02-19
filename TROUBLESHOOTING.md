# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Server error. Please try again later."

This error can occur due to several reasons:

#### Check 1: MongoDB Connection
```bash
# Verify MongoDB URI is correct in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

**Solution:**
- Check MongoDB Atlas dashboard
- Verify IP whitelist (add 0.0.0.0/0 for all IPs)
- Ensure database user has read/write permissions
- Test connection string

#### Check 2: Environment Variables
Ensure all required variables are set in Vercel:
- `MONGODB_URI`
- `EMAIL_USER`
- `EMAIL_PASS`
- `FRONTEND_URL`

**How to check in Vercel:**
1. Go to your project in Vercel
2. Settings → Environment Variables
3. Verify all variables are present

#### Check 3: View Logs
```bash
# In Vercel Dashboard:
1. Go to your deployment
2. Click on "Functions" tab
3. Click on any function to see logs
4. Look for error messages
```

#### Check 4: Test API Directly
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

### 2. CORS Errors

**Symptoms:**
- "Access to fetch has been blocked by CORS policy"
- Network request fails in browser console

**Solution:**
1. Check `server.js` CORS configuration
2. Verify frontend URL is in whitelist:
```javascript
const corsOptions = {
  origin: [
    'https://store-space-pr3899.vercel.app',
    'http://localhost:3000'
  ]
};
```

3. Redeploy backend after changes

### 3. Email Not Sending

**Symptoms:**
- Reservation created but no email received
- "Email sending failed" in logs

**Solution:**

#### Gmail App Password Setup:
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable it)
3. Security → App Passwords
4. Generate new app password
5. Use this password in `EMAIL_PASS`

#### Verify Email Configuration:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
```

**Note:** Email failures don't stop reservation creation!

### 4. Validation Errors

**"All fields are required"**
- Ensure all form fields are filled
- Check network tab for request payload

**"Please enter a valid email address"**
- Email must be in format: user@domain.com

**"Please enter a valid mobile number"**
- Mobile must be 10-15 digits
- Only numbers allowed

**"Move-in date cannot be in the past"**
- Select today or future date

### 5. Database Issues

**"A reservation with this email already exists"**
- Each email can only have one reservation per space type
- Use different email or delete existing reservation

**MongoDB Connection Timeout:**
```javascript
// Add to .env
MONGODB_URI=mongodb+srv://...?retryWrites=true&w=majority&connectTimeoutMS=30000
```

### 6. Deployment Issues

**Vercel Build Fails:**
1. Check `vercel.json` exists
2. Verify `package.json` has all dependencies
3. Check build logs in Vercel dashboard

**Function Timeout:**
- Vercel free tier has 10s timeout
- Optimize database queries
- Consider upgrading plan

### 7. Frontend-Backend Connection

**Request fails immediately:**
1. Check API URL in frontend `.env`:
```env
REACT_APP_API_URL=https://store-backend-nine-opal.vercel.app
```

2. Verify backend is running:
```bash
curl https://store-backend-nine-opal.vercel.app
# Should return: {"message":"Storage Reservation API running!"}
```

3. Check browser console for errors

**Request hangs/times out:**
- Backend might be cold starting (first request after idle)
- Wait 10-15 seconds and try again
- Check Vercel function logs

## Debug Mode

### Enable Detailed Logging

Backend already has console.log statements. View them in:

**Vercel Dashboard:**
1. Project → Deployments
2. Click on latest deployment
3. Functions tab
4. Click on function name
5. View real-time logs

**Local Development:**
```bash
npm start
# Logs will appear in terminal
```

### Test Each Endpoint

```bash
# Test main reservation
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","mobile":"1234567890","firstName":"John","lastName":"Doe","moveInDate":"2024-12-31"}'

# Test tent reservation
curl -X POST http://localhost:5000/api/tent \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","mobile":"1234567890","firstName":"John","lastName":"Doe","moveInDate":"2024-12-31"}'
```

## Quick Fixes

### Reset Everything

1. **Clear MongoDB Collections:**
```javascript
// In MongoDB Atlas
// Collections → Select collection → Delete all documents
```

2. **Redeploy Backend:**
```bash
# In Vercel dashboard
Deployments → Latest → Redeploy
```

3. **Clear Browser Cache:**
```
Chrome: Ctrl+Shift+Delete
Firefox: Ctrl+Shift+Delete
Safari: Cmd+Option+E
```

### Verify Setup Checklist

- [ ] MongoDB Atlas cluster running
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Database user created with permissions
- [ ] All environment variables set in Vercel
- [ ] Gmail app password generated
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] CORS configured correctly
- [ ] API URL correct in frontend

## Still Having Issues?

1. **Check Vercel Logs:**
   - Most errors will show here with stack traces

2. **Test Locally:**
   ```bash
   cd store-backend
   npm install
   npm start
   ```

3. **Verify MongoDB:**
   - Can you connect using MongoDB Compass?
   - Are collections created?

4. **Check Network Tab:**
   - Open browser DevTools
   - Network tab
   - Submit form
   - Check request/response

## Contact Support

If none of these solutions work:

1. Check GitHub Issues
2. Review Vercel deployment logs
3. Verify all environment variables
4. Test with Postman/cURL first

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Server error" | Multiple possible causes | Check logs, verify MongoDB, check env vars |
| "CORS policy" | Frontend URL not whitelisted | Add URL to CORS config |
| "All fields required" | Missing form data | Fill all fields |
| "Invalid email" | Wrong email format | Use valid email |
| "Past date" | Selected past date | Choose future date |
| "Email exists" | Duplicate reservation | Use different email |
| "Connection timeout" | MongoDB unreachable | Check IP whitelist |
| "Email failed" | Gmail config wrong | Verify app password |

## Performance Tips

1. **MongoDB Indexes:**
```javascript
// Add index on email for faster lookups
reservationSchema.index({ email: 1 });
```

2. **Connection Pooling:**
```javascript
// Already configured in mongoose.connect()
```

3. **Error Handling:**
- All controllers now have proper error handling
- Errors are logged for debugging
- User-friendly messages returned

## Monitoring

**Check API Health:**
```bash
curl https://store-backend-nine-opal.vercel.app
```

**Expected Response:**
```json
{
  "message": "Storage Reservation API running!",
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
