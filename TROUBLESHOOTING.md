# Troubleshooting Guide

## Common Production Issues

### 1. CSRF Token 403 Errors

**Symptoms:**

- Getting 403 "Invalid CSRF token" on POST/PUT/DELETE requests
- Uploads failing with 403 status

**Solutions:**

1. Check that `VITE_API_URL` in `.env.production` matches your backend URL
2. Verify the CSRF token cookie is being set:
   - Open DevTools → Application → Cookies
   - Look for `csrf_token` cookie from your backend domain
3. Ensure the backend CORS config includes `x-csrf-token` in `allowedHeaders`
4. Verify `credentials: 'include'` is set in all API requests

**How to test:**

```javascript
// In browser console
fetch("https://your-backend.onrender.com/api/health", {
  credentials: "include",
}).then(() => console.log("Cookies:", document.cookie));
```

### 2. API Base URL Issues

**Symptoms:**

- API requests going to localhost in production
- CORS errors in production
- 404 errors on API calls

**Solutions:**

1. Verify `.env.production` exists with correct `VITE_API_URL`
2. Rebuild frontend after changing environment variables
3. Check that Vite is using the production env file:
   ```bash
   npm run build
   ```
4. Verify in built files that the correct URL is present:
   ```bash
   type Frontend\dist\assets\index-*.js | findstr "VITE_API_URL"
   ```

### 3. 404 on Page Refresh

**Symptoms:**

- Direct navigation to routes like `/partner/dashboard` returns 404
- Refreshing any non-root page shows 404

**Solutions:**

1. Add rewrite rule in Render dashboard:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
2. Or verify `render.yaml` has the routes section configured
3. For other static hosts, add similar SPA rewrite rules

### 4. Logout Not Clearing UI State

**Symptoms:**

- After logout, still seeing authenticated UI
- Partner routes accessible after logout

**Solutions:**

- Partner logout now redirects to `/auth/food-partner/login`
- User logout redirects to home
- Protected routes now use `PartnerPrivateRoute` for partner-only pages
- Clear browser cache and cookies if issues persist

### 5. Cookie Not Being Sent

**Symptoms:**

- Authentication cookies not being sent with requests
- Getting 401 errors despite being logged in

**Solutions:**

1. Verify cookies have correct attributes:
   - `Secure: true` (requires HTTPS)
   - `SameSite: None` (for cross-origin)
   - `HttpOnly: true` (for auth tokens)
2. Ensure both frontend and backend are on HTTPS in production
3. Check that `withCredentials: true` is set in Axios config
4. Verify `CLIENT_ORIGINS` includes your frontend URL

### 6. ImageKit Upload Failures

**Symptoms:**

- 500 errors when uploading images/videos
- "ImageKit credentials missing" errors

**Solutions:**

1. Verify all three ImageKit env vars are set:
   - `IMAGE_KIT_PUBLIC_KEY`
   - `IMAGE_KIT_PRIVATE_KEY`
   - `IMAGE_KIT_URL_ENDPOINT`
2. Check file size limits (backend: 50MB, adjust if needed)
3. Verify ImageKit account is active and has storage space

### 7. CORS Errors

**Symptoms:**

- "Access-Control-Allow-Origin" errors in console
- Preflight OPTIONS requests failing

**Solutions:**

1. Verify `CLIENT_ORIGINS` env var includes your frontend URL
2. Check that backend CORS config allows your origin
3. Ensure `credentials: true` is in CORS config
4. Verify `x-csrf-token` is in `allowedHeaders`

## Debugging Checklist

Before deploying:

- [ ] All environment variables set in Render dashboard
- [ ] `VITE_API_URL` points to production backend
- [ ] `CLIENT_ORIGINS` includes production frontend URL
- [ ] ImageKit credentials are valid
- [ ] Rewrite rule configured for SPA routing
- [ ] HTTPS enabled on both frontend and backend

After deploying:

- [ ] Test login flow (both user and partner)
- [ ] Test CSRF token by creating a reel
- [ ] Test logout and verify redirect
- [ ] Test protected routes (should redirect if not authenticated)
- [ ] Test page refresh on deep links (should not 404)
- [ ] Check browser DevTools for cookie attributes
- [ ] Verify API requests include CSRF token header

## Environment Variable Reference

### Backend (.env)

```
NODE_ENV=production
CLIENT_ORIGINS=https://your-frontend.onrender.com
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
IMAGE_KIT_PUBLIC_KEY=public_...
IMAGE_KIT_PRIVATE_KEY=private_...
IMAGE_KIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
```

### Frontend (.env.production)

```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Getting Help

If issues persist:

1. Check browser DevTools Console for errors
2. Check Network tab for failed requests
3. Verify cookies in Application tab
4. Check backend logs in Render dashboard
5. Test API endpoints directly with curl or Postman
