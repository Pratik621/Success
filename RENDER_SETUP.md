# Render Deployment Configuration

## Frontend Service (sucess-1.onrender.com)

### Environment Variables to Set on Render:
```
VITE_API_URL=https://sucess-eia3.onrender.com/api
```

### Build Command:
```
npm run build
```

### Start Command:
```
npm run preview
```

---

## Backend Service (sucess-eia3.onrender.com)

### Environment Variables to Set on Render:
```
PORT=5000
MONGO_URI=mongodb+srv://manepratik3727_db_user:kanchan123@cluster0.tnkdy3x.mongodb.net/?appName=Cluster0
JWT_SECRET=8fK#92kL!xPq7Zr@LmN5vTq1YwU8bHcD
ADMIN_EMAIL=manepratik3727@gmail.com
ADMIN_PASSWORD=Admin@123
FRONTEND_URL=https://sucess-1.onrender.com
```

### Build Command:
```
npm install
```

### Start Command:
```
node server.js
```

---

## Important Notes

1. **Frontend Environment Variables**: Must be set BEFORE building. Vite bakes these into the build at compile time.
2. **After setting env vars on Render**: Click "Redeploy" to rebuild the frontend with the correct API URL.
3. **CORS**: Backend CORS is already configured to accept requests from `https://sucess-1.onrender.com`
4. **API Endpoints**: All requests from frontend will be sent to `https://sucess-eia3.onrender.com/api`

## Troubleshooting

If login page still doesn't work:
1. Open browser DevTools (F12)
2. Check Network tab - API requests should go to `https://sucess-eia3.onrender.com/api`
3. Check Console for any error messages
4. Verify backend is running and responding at `https://sucess-eia3.onrender.com/api/auth/login`
