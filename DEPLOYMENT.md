# Deployment Configuration

## Backend (Web Service) - reelify-pr6n.onrender.com

### Environment Variables

Add these in Render Dashboard → Backend Service → Environment:

```
NODE_ENV=production
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
CLIENT_ORIGINS=https://reel-style-food-app.onrender.com
IMAGE_KIT_PUBLIC_KEY=<your_imagekit_public_key>
IMAGE_KIT_PRIVATE_KEY=<your_imagekit_private_key>
IMAGE_KIT_URL_ENDPOINT=<your_imagekit_url_endpoint>
```

Note: In development, you can add multiple origins separated by commas (e.g., `https://reel-style-food-app.onrender.com,http://localhost:5173`)

## Frontend (Static Site) - reel-style-food-app.onrender.com

### Redirects/Rewrites

Add in Render Dashboard → Frontend Service → Redirects/Rewrites:

**Rule 1:**

- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

### Headers (Optional but Recommended)

Add in Render Dashboard → Frontend Service → Headers:

**Rule 1:**

- Path: `/index.html`
- Name: `Cache-Control`
- Value: `no-cache`

**Rule 2:**

- Path: `/assets/*`
- Name: `Cache-Control`
- Value: `public, max-age=31536000, immutable`

## Verification Checklist

After deployment:

1. ✅ Login as Food Partner from https://reel-style-food-app.onrender.com
2. ✅ Check DevTools → Application → Cookies → https://reelify-pr6n.onrender.com
   - Should see `partner_token` with `Domain=.onrender.com`, `SameSite=None`, `Secure=true`
3. ✅ POST a new reel - should return 201 Created
4. ✅ Refresh deep routes (e.g., /partner/dashboard) - should not 404
5. ✅ Check Network tab - OPTIONS requests should return 200/204 with CORS headers
