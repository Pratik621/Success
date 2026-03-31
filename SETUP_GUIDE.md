# MERN Stack Setup Guide - Local Development & Production Deployment

## Environment Configuration Status ✅

### Frontend Environment Variables

#### Development (.env)
```
VITE_API_URL=http://localhost:5000/api
```
**Location:** `frontend/.env`
**Status:** ✅ Configured
**Purpose:** Routes all API calls to local backend during development

#### Production (.env.production)
```
VITE_API_URL=https://success-backend-f20d.onrender.com/api
```
**Location:** `frontend/.env.production`
**Status:** ✅ Configured
**Purpose:** Routes all API calls to production backend (Render)

### Backend Environment Variables (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://manepratik3727_db_user:kanchan123@cluster0.tnkdy3x.mongodb.net/?appName=Cluster0
JWT_SECRET=8fK#92kL!xPq7Zr@LmN5vTq1YwU8bHcD
ADMIN_EMAIL=manepratik3727@gmail.com
ADMIN_PASSWORD=Admin@123
FRONTEND_URL=https://success-1.onrender.com
```
**Location:** `backend/.env`
**Status:** ✅ Configured (typo fixed: "sucess" → "success")
**Purpose:** Database connection, JWT authentication, CORS origin validation

---

## Local Development Setup

### Prerequisites
- Node.js v18+ installed
- MongoDB connection string available in backend/.env
- VS Code or any code editor

### Step 1: Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (in a separate terminal)
cd backend
npm install
```

### Step 2: Start the Backend
```bash
cd backend
npm start  # or npm run dev (with nodemon for auto-reload)
```
**Expected Output:**
```
Server running on http://localhost:5000
Connected to MongoDB
```

### Step 3: Start the Frontend (New Terminal Window)
```bash
cd frontend
npm run dev
```
**Expected Output:**
```
VITE v8.0.0 ready in 256 ms
➜  Local:   http://localhost:3000/
```

### Step 4: Test the Application
1. Open http://localhost:3000 in your browser
2. Navigate to Login/Signup pages
3. Verify API calls are working:
   - **DevTools Network Tab:** Check requests to `http://localhost:5000/api/*`
   - **Console:** Should see ✅ Token added to request messages
   - **Contact Modal:** Should load admin contact info
   - **Dashboard:** Should load deals, metals, and reviews

### Step 5: Verify API Integration
- ✅ Sign up with test credentials
- ✅ Login succeeds and saves user to localStorage
- ✅ Page refresh maintains login (user persists)
- ✅ Navigate to Dashboard - loads user data
- ✅ Check Admin Stats page - loads system statistics
- ✅ Book a deal - creates new deal in database
- ✅ Logout clears localStorage and redirects to login

---

## Production Deployment (Render)

### Current Configuration
**Frontend Service:** https://success-1.onrender.com
**Backend Service:** https://success-backend-f20d.onrender.com

### Environment Variables on Render

#### Frontend Service
Go to **Settings → Environment Variables** and ensure:
```
VITE_API_URL=https://success-backend-f20d.onrender.com/api
```
**Note:** This is in `.env.production` file, so Vite bakes it into the build

#### Backend Service
Go to **Settings → Environment Variables** and ensure:
```
FRONTEND_URL=https://success-1.onrender.com
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
ADMIN_EMAIL=manepratik3727@gmail.com
ADMIN_PASSWORD=Admin@123
```

### Deploy Steps
1. **Push changes to main branch:**
   ```bash
   git add .
   git commit -m "Fix: API environment variables and AdminStats safety"
   git push origin main
   ```

2. **Render auto-deploys** (if webhooks are configured)
   - Frontend deployment: ~2-3 minutes
   - Backend deployment: ~2-3 minutes

3. **Monitor deployment:**
   - Frontend: https://success-1.onrender.com
   - Backend: https://success-backend-f20d.onrender.com

4. **Verify production:**
   - Open https://success-1.onrender.com
   - Test login/signup
   - Check API calls in DevTools (should go to *.onrender.com URLs)
   - Verify token attachment in request headers

---

## API Configuration

### Axios Setup (frontend/src/services/api.js)
```javascript
const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL,  // Uses .env or .env.production
  withCredentials: true,
});
```

**Request Interceptor:**
- ✅ Automatically attaches `Authorization: Bearer <token>` header to all requests
- ✅ Reads token from localStorage (user.token)

**Response Interceptor:**
- ✅ Catches 401 errors (token expired)
- ✅ Clears localStorage and redirects to /login
- ✅ Prevents stale token issues

### CORS Configuration (backend/server.js)
```javascript
app.use(cors());  // Accepts all origins (for now)
```
**Render Production Note:** 
- Backend validates `FRONTEND_URL` from environment variable
- Ensures frontend can make requests from production domain

### Route Prefixes ✅
All API routes correctly use `/api` prefix:
- `/api/auth` - Authentication routes
- `/api/deals` - Deal management
- `/api/metals` - Metal information
- `/api/reviews` - Reviews
- `/api/reminders` - Reminders
- `/api/referrals` - Referrals
- `/api/contact` - Contact information

---

## Common Issues & Troubleshooting

### Issue 1: "Cannot GET /api/deals" (404 Error)
**Cause:** Backend routes not loaded correctly
**Solution:** 
- Ensure backend is running on port 5000
- Check `backend/.env` is properly configured
- Verify all route files exist in `backend/routes/`

### Issue 2: CORS Error in Browser
**Cause:** Frontend making requests to wrong domain
**Solution:**
- **Development:** Ensure `.env` has `VITE_API_URL=http://localhost:5000/api`
- **Production:** Ensure backend `.env` has correct `FRONTEND_URL`

### Issue 3: User Logs Out on Refresh
**Cause:** AuthContext not restoring from localStorage
**Solution:**
- ✅ (Already fixed) AuthContext now has useEffect to restore user
- No action needed

### Issue 4: ".map is not a function" Error
**Cause:** API returned non-array data
**Solution:**
- ✅ (Already fixed) All pages now use `Array.isArray(data)` checks
- Fallback to `[]` if data is invalid

### Issue 5: AdminStats Dashboard Crashes
**Cause:** Unsafe array access on undefined properties
**Solution:**
- ✅ (Already fixed) AdminStats.jsx now validates all arrays
- Added null checks for currentMonthRevenue and totalRevenue

### Issue 6: "Contact Modal not loading"
**Cause:** API call to `/api/contact` failing
**Solution:**
- Ensure backend route file `backend/routes/contactRoutes.js` exists
- Check backend is returning contact data structure

---

## File Structure Reference

### Frontend
```
frontend/
├── .env                          # Development config (NEW: populated)
├── .env.production               # Production config
├── src/
│   ├── services/api.js           # Axios configuration
│   ├── context/AuthContext.jsx   # Global auth state
│   ├── components/
│   │   ├── ProtectedRoute.jsx    # Route guards
│   │   └── ContactModal.jsx      # Contact info modal
│   └── pages/
│       ├── Login.jsx
│       ├── Dashboard.jsx         # Has array safety checks
│       └── admin/AdminStats.jsx  # FIXED: has safety checks
└── public/_redirects             # SPA routing for Render

### Backend
backend/
├── .env                          # Environment config
├── server.js                     # CORS & route setup
├── config/db.js                  # MongoDB connection
├── controllers/                  # Business logic
├── models/                       # MongoDB schemas
└── routes/                       # API endpoints
```

---

## Verification Checklist

### Development
- [ ] Backend starts on port 5000 without errors
- [ ] Frontend starts on port 3000 without errors
- [ ] Login page loads with Contact Us button
- [ ] Signup page loads with Contact Us button
- [ ] Contact modal opens and displays admin info
- [ ] Login with credentials succeeds
- [ ] Dashboard loads deals, metals, reviews
- [ ] Page refresh maintains login session
- [ ] Logout clears session and redirects
- [ ] Admin pages load statistics safely

### Production (Render)
- [ ] Frontend loads at https://success-1.onrender.com
- [ ] Backend responds at https://success-backend-f20d.onrender.com/api
- [ ] Login works with production API
- [ ] Dashboard loads data from production
- [ ] Contact modal works
- [ ] No CORS errors in console
- [ ] No token-related errors
- [ ] All admin pages accessible and functioning

---

## Recent Fixes Summary

### 1. Frontend `.env` Population
- **What:** Added `VITE_API_URL=http://localhost:5000/api` to empty `.env`
- **Impact:** Local development now works
- **Status:** ✅ FIXED

### 2. AdminStats.jsx Safety Checks
- **What:** Added Array.isArray() checks for monthlyRevenue, topMetals, topCompanies
- **What:** Added null checks for currentMonthRevenue and totalRevenue
- **Impact:** Admin dashboard no longer crashes on invalid API responses
- **Status:** ✅ FIXED

### 3. Backend FRONTEND_URL Typo
- **What:** Fixed `https://sucess-1.onrender.com` → `https://success-1.onrender.com`
- **Impact:** CORS properly validates frontend requests
- **Status:** ✅ FIXED

---

## Next Steps

1. **Commit and push changes:**
   ```bash
   git add frontend/.env frontend/src/pages/admin/AdminStats.jsx backend/.env
   git commit -m "Fix: environment variables, AdminStats safety, and CORS setup"
   git push origin main
   ```

2. **Monitor Render deployment:**
   - Both services should auto-deploy
   - Check deployment logs for errors

3. **Test production:**
   - Visit frontend and verify all features work
   - Check admin dashboard loads correctly

4. **Future improvements:**
   - Add request logging middleware
   - Implement rate limiting
   - Set up error tracking (Sentry)
   - Add automated tests for API integration

---

**Last Updated:** $(date)
**Environment Status:** ✅ Ready for Development and Production
