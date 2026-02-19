# Storage Reservation Backend API

Backend API for storage space reservation system with email notifications.

## 🚀 Deployment

**Live API**: https://store-backend-nine-opal.vercel.app

## 📡 API Endpoints

### Health Check
```
GET /
```
Returns API status and health information.

### Reservation Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reservations` | POST | Create reservation for 10'x10' space |
| `/api/tent` | POST | Create reservation for 10'x20' space |
| `/api/un1` | POST | Create reservation for Unit 1 |
| `/api/un2` | POST | Create reservation for Unit 2 |
| `/api/un3` | POST | Create reservation for Unit 3 |
| `/api/un4` | POST | Create reservation for Unit 4 |
| `/api/un5` | POST | Create reservation for Unit 5 |

### Request Format

All POST endpoints accept:
```json
{
  "email": "user@example.com",
  "mobile": "1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "moveInDate": "2024-03-15T00:00:00.000Z"
}
```

### Response Format

**Success (201)**:
```json
{
  "success": true,
  "message": "Reservation created successfully! Check your email for confirmation.",
  "data": {
    "id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "moveInDate": "2024-03-15T00:00:00.000Z",
    "spaceNumber": "#3008",
    "spaceSize": "10' x 10'",
    "monthlyRent": 170,
    "adminFee": 25,
    "securityDeposit": 50,
    "totalCost": 195
  }
}
```

**Error (400/500)**:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🛠️ Local Development

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Gmail account for email notifications

### Setup

1. **Clone repository**
```bash
git clone https://github.com/aquiiibbb/store-backend.git
cd store-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

4. **Start server**
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📧 Email Configuration

The system sends two emails for each reservation:

1. **Customer Confirmation Email**
   - Sent to customer's email
   - Contains reservation details
   - Includes move-in date and pricing

2. **Admin Notification Email**
   - Sent to admin email
   - Contains customer information
   - Includes all reservation details

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in `EMAIL_PASS`

## 🗄️ Database Schema

### Reservation Model

```javascript
{
  email: String (required),
  mobile: String (required),
  firstName: String (required),
  lastName: String (required),
  moveInDate: Date (required),
  spaceNumber: String (default: '#3008'),
  spaceSize: String (default: "10' x 10'"),
  monthlyRent: Number (default: 170),
  adminFee: Number (default: 25),
  securityDeposit: Number (default: 50),
  totalCost: Number (default: 195),
  status: String (enum: ['pending', 'confirmed', 'cancelled'], default: 'pending'),
  timestamps: true
}
```

## ✅ Validation

- Email: Valid email format
- Mobile: 10-15 digits
- Names: Required, trimmed
- Move-in Date: Cannot be in the past

## 🔒 Security Features

- CORS enabled for specific origins
- Input validation and sanitization
- MongoDB injection prevention
- Error handling middleware
- Environment variable protection

## 📦 Dependencies

```json
{
  "express": "^5.2.1",
  "mongoose": "^9.2.1",
  "cors": "^2.8.6",
  "dotenv": "^17.3.1",
  "nodemailer": "^8.0.1",
  "bcryptjs": "^3.0.3",
  "jsonwebtoken": "^9.0.3"
}
```

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Vercel Configuration

Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## 🔗 Frontend Repository

- **Frontend**: [store-space-pr3](https://github.com/aquiiibbb/store-space-pr3)
- **Frontend URL**: https://store-space-pr3899.vercel.app

## 📝 API Testing

### Using cURL

```bash
curl -X POST https://store-backend-nine-opal.vercel.app/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "mobile": "1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "moveInDate": "2024-03-15T00:00:00.000Z"
  }'
```

### Using Postman

1. Method: POST
2. URL: `https://store-backend-nine-opal.vercel.app/api/reservations`
3. Headers: `Content-Type: application/json`
4. Body: Raw JSON (see request format above)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Ensure network access is configured

### Email Not Sending
- Verify Gmail App Password
- Check EMAIL_USER and EMAIL_PASS
- Review email logs in console

### CORS Errors
- Add frontend URL to CORS whitelist
- Check origin in request headers

## 📧 Support

For issues, create a GitHub issue in the repository.
