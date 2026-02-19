# 🚀 Quick Reference Card

## Essential URLs

| Resource | URL |
|----------|-----|
| **Backend API** | https://store-backend-nine-opal.vercel.app |
| **Frontend** | https://store-space-pr3899.vercel.app |
| **GitHub Backend** | https://github.com/aquiiibbb/store-backend |
| **GitHub Frontend** | https://github.com/aquiiibbb/store-space-pr3 |

## API Endpoints

```
GET  /                    → Health check
POST /api/reservations    → 10'x10' space ($170/month)
POST /api/tent            → 10'x20' space ($190/month)
POST /api/un1             → Storage Unit 1
POST /api/un2             → Storage Unit 2
POST /api/un3             → Storage Unit 3
POST /api/un4             → Storage Unit 4
POST /api/un5             → Storage Unit 5
```

## Quick Commands

```bash
# Test API health
curl https://store-backend-nine-opal.vercel.app

# Run all tests
npm test

# Start local server
npm start

# Development mode
npm run dev

# Test single endpoint
curl -X POST https://store-backend-nine-opal.vercel.app/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","mobile":"1234567890","firstName":"John","lastName":"Doe","moveInDate":"2024-12-31T00:00:00.000Z"}'
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://store-space-pr3899.vercel.app
```

## Request Format

```json
{
  "email": "user@example.com",
  "mobile": "1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "moveInDate": "2024-12-31T00:00:00.000Z"
}
```

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Reservation created successfully!",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Common Issues

| Error | Solution |
|-------|----------|
| Server error | Check Vercel logs |
| CORS error | Verify frontend URL in CORS config |
| Email not sent | Check Gmail app password |
| Validation error | Fill all fields correctly |
| Duplicate email | Use different email |

## Debugging

**View Logs:**
```
Vercel Dashboard → Deployments → Latest → Functions → Click function
```

**Check MongoDB:**
```
MongoDB Atlas → Database → Browse Collections
```

**Test Locally:**
```bash
git clone https://github.com/aquiiibbb/store-backend.git
cd store-backend
npm install
npm start
```

## File Structure

```
store-backend/
├── server.js                 # Main server file
├── vercel.json              # Vercel config
├── package.json             # Dependencies
├── test-api.js              # Test script
├── .env                     # Environment variables
├── src/
│   ├── controller/          # Request handlers
│   │   ├── controlles.js    # 10x10 reservations
│   │   ├── controlles1.js   # 10x20 reservations
│   │   ├── un1.js           # Unit 1
│   │   ├── un2.js           # Unit 2
│   │   ├── un3.js           # Unit 3
│   │   ├── un4.js           # Unit 4
│   │   └── un5.js           # Unit 5
│   ├── model/               # Database schemas
│   ├── Routes/              # API routes
│   └── Config/              # Email config
└── docs/
    ├── README.md            # Main documentation
    ├── TROUBLESHOOTING.md   # Debug guide
    └── ERROR_FIX_SUMMARY.md # Recent fixes
```

## Validation Rules

| Field | Rule |
|-------|------|
| Email | Valid format (user@domain.com) |
| Mobile | 10-15 digits only |
| First Name | Required, trimmed |
| Last Name | Required, trimmed |
| Move-in Date | Cannot be past date |

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Server Error |

## MongoDB Collections

```
feedbackDB/
├── reservations     # 10'x10' spaces
├── reservation1s    # 10'x20' spaces
├── reservation2s    # Unit 1
├── reservation3s    # Unit 2
├── reservation4s    # Unit 3
├── reservation5s    # Unit 4
└── reservation6s    # Unit 5
```

## Email Configuration

**Gmail Setup:**
1. Enable 2FA
2. Generate App Password
3. Use in `EMAIL_PASS`

**Emails Sent:**
- Customer confirmation
- Admin notification

## Deployment

**Auto-Deploy:**
```bash
git push origin main
# Vercel auto-deploys
```

**Manual Deploy:**
```
Vercel Dashboard → Deployments → Redeploy
```

## Monitoring

**Health Check:**
```bash
curl https://store-backend-nine-opal.vercel.app
```

**Expected:**
```json
{
  "message": "Storage Reservation API running!",
  "status": "healthy",
  "timestamp": "..."
}
```

## Support Files

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `TROUBLESHOOTING.md` | Debug guide |
| `ERROR_FIX_SUMMARY.md` | Recent fixes |
| `SETUP.md` | Setup instructions |
| `test-api.js` | Automated tests |

## Quick Fixes

**Reset MongoDB:**
```
MongoDB Atlas → Collections → Delete documents
```

**Redeploy:**
```
Vercel → Deployments → Redeploy
```

**Clear Cache:**
```
Browser → Ctrl+Shift+Delete
```

## Testing Checklist

- [ ] MongoDB connected
- [ ] Environment variables set
- [ ] Gmail configured
- [ ] CORS configured
- [ ] API health check passes
- [ ] Test script passes
- [ ] Frontend can connect

## Performance

**Response Times:**
- Health check: ~100ms
- Reservation: ~500-1000ms
- Email: +200-500ms

**Limits:**
- Vercel timeout: 10s
- MongoDB connections: 500
- Email rate: 500/day (Gmail)

## Security

✅ CORS enabled
✅ Input validation
✅ MongoDB injection prevention
✅ Environment variables protected
✅ Error messages sanitized

## Pricing

**Free Tier Limits:**
- Vercel: 100GB bandwidth/month
- MongoDB Atlas: 512MB storage
- Gmail: 500 emails/day

## Next Steps

1. ✅ Backend deployed
2. ✅ Frontend connected
3. ✅ Error handling added
4. ✅ Testing tools created
5. ⏳ Monitor and optimize

## Contact

- GitHub Issues: Report bugs
- Vercel Logs: Check errors
- MongoDB Atlas: Database issues

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Production Ready ✅
