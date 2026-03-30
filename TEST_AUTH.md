# Authentication Debugging Guide

## Test Backend Token Generation

### Using Postman or cURL:

1. **Test Admin Login**:
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manepratik3727@gmail.com",
    "password": "Admin@123"
  }'
```

Expected Response:
```json
{
  "_id": "...",
  "companyName": "Admin",
  "email": "manepratik3727@gmail.com",
  "phone": "0000000000",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

2. **Test Protected Route with Token**:
```bash
curl http://localhost:5000/api/auth/admin/notifs \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```

Expected Response:
```json
{
  "pendingDeals": 0,
  "pendingReviews": 0,
  "newReferrals": 0,
  "todayReminders": 0
}
```

---

## Frontend Checklist

- [ ] Can access admin login page at `/admin/login`
- [ ] Can submit login form without errors
- [ ] After login, redirects to `/admin`
- [ ] LocalStorage shows user object with token
- [ ] DevTools Console shows token debug logs
- [ ] Network requests include Authorization header

---

## Backend Checks

- [ ] Backend running on port 5000
- [ ] MongoDB connected (check logs)
- [ ] JWT_SECRET set in .env
- [ ] Admin account seeded during startup
- [ ] Check server logs for any errors

