# SPA Routing & Persistent Login Fix

This document explains the fixes applied to handle client-side routing and persistent authentication.

---

## ✅ Issues Fixed

### 1. **404 Error on Page Refresh**
**Problem**: Refreshing on routes like `/dashboard` returns 404

**Root Cause**: Server was trying to serve actual files instead of routing to `index.html`

**Solution**: Added `_redirects` file for Render SPA routing

**File**: `frontend/public/_redirects`
```
/*    /index.html   200
```

This tells Render to serve `index.html` for all routes, allowing React Router to handle client-side navigation.

---

### 2. **Persistent Login After Refresh**
**Problem**: Users get logged out when refreshing the page

**Root Cause**: Auth state was not being restored from localStorage on app load

**Solution**: Enhanced AuthContext to restore user session on app load

**File**: `frontend/src/context/AuthContext.jsx`
```javascript
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      localStorage.removeItem('user');
    }
  }
  setIsLoading(false);
}, []);
```

---

## 📋 Implementation Details

### AuthContext Changes
- ✅ Added `isLoading` state to show loading spinner while restoring session
- ✅ Added `useEffect` hook to restore user from localStorage on mount
- ✅ Better error handling for corrupted localStorage data
- ✅ Console logs for debugging

### ProtectedRoute Changes
- ✅ Shows `Spinner` component while checking auth state
- ✅ Updated all route types: `ProtectedRoute`, `AdminRoute`, `GuestRoute`
- ✅ Prevents flash of content before auth check completes

### API Service Changes
- ✅ Added response interceptor to handle token expiration (401 errors)
- ✅ Automatically redirects to `/login` if token expires
- ✅ Added `withCredentials: true` for cookie-based auth support
- ✅ Better error logging

### Vite Configuration
- ✅ Added preview port configuration for testing production build locally

---

## 🔐 How Persistent Login Works

### 1. **On Login**
```
User fills form → authAPI.login(data) → Response includes token
↓
login(data) → stores in localStorage → sets auth state
```

### 2. **On Page Refresh**
```
User refreshes page → App mounts → AuthContext useEffect fires
↓
Reads localStorage('user') → Restores user state → Shows content
↓
All API requests include Authorization header: Bearer <token>
```

### 3. **On Logout**
```
User clicks logout → logout() → Removes from localStorage
↓
Sets user state to null → Redirects to /login
```

### 4. **On Token Expiration**
```
API returns 401 → Response interceptor catches it
↓
Clears localStorage → Redirects to /login
↓
User must login again to get new token
```

---

## 📁 Files Modified

| File | Changes |
|------|---------|
| `frontend/public/_redirects` | **Created** - SPA routing rules for Render |
| `frontend/src/context/AuthContext.jsx` | Added useEffect hook, isLoading state |
| `frontend/src/components/ProtectedRoute.jsx` | Added isLoading check, Spinner display |
| `frontend/src/services/api.js` | Added response interceptor for 401 errors |
| `frontend/vite.config.js` | Added preview port config |

---

## 🚀 Deployment on Render

### Frontend Service Setup
1. **Build Command**: `npm run build`
2. **Start Command**: `npm run preview`
3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

### Why _redirects is Important
- Render uses the `_redirects` file (Netlify format) to configure SPA routing
- Without it, any direct URL refresh returns 404
- With it, all requests go to `index.html`, allowing React Router to work

### Verifying the Fix
1. Deploy to Render
2. Visit `https://your-app.onrender.com/login`
3. Sign in with valid credentials
4. Navigate to `/dashboard`
5. **Refresh the page** (Ctrl+R or Cmd+R)
6. Should see dashboard, NOT 404

---

## 💾 localStorage Structure

When logged in, localStorage stores:
```javascript
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "companyName": "Company Name",
    "role": "user", // or "admin"
    "token": "eyJhbGciOi..." // JWT token
    // ... other user fields
  }
}
```

---

## 🔍 Debugging

### Check if user is persisted:
```javascript
// Open DevTools Console
console.log(JSON.parse(localStorage.getItem('user')))
```

### Check API token:
```javascript
// DevTools Console
const user = JSON.parse(localStorage.getItem('user'))
console.log('Token:', user?.token)
```

### Check request headers:
```
DevTools → Network tab → Any API request → Headers
Look for: Authorization: Bearer <token>
```

### Check if routes work:
1. Login successfully
2. Visit `/dashboard`, `/profile`, `/my-deals`
3. Refresh each page - should all work
4. Check console for "✅ Token added to request"

---

## 📝 Notes

- **Token Storage**: Using localStorage (not HttpOnly cookies) for simplicity
  - For production with sensitive data, consider HttpOnly cookies
- **Token Expiration**: Currently redirects on 401
  - Can be enhanced with automatic refresh token logic
- **Session Timeout**: No auto-logout on inactivity (can be added if needed)
- **Multiple Tabs**: Session syncs across tabs via localStorage events

---

## ✨ Testing Checklist

- [ ] Can log in successfully
- [ ] Token appears in Authorization header
- [ ] Page refresh doesn't cause 404
- [ ] User stays logged in after refresh
- [ ] Protected routes work on direct URL
- [ ] Can navigate between routes
- [ ] Logout clears session properly
- [ ] Invalid token causes redirect to login
- [ ] Works on desktop and mobile browsers
- [ ] Works after clearing browser cache

