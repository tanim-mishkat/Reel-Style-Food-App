# Render Production Configuration

## Backend Service (reelify-pr6n.onrender.com)

### Environment Variables

```
NODE_ENV=production
CLIENT_ORIGINS=https://reel-style-food-app.onrender.com
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
IMAGE_KIT_PUBLIC_KEY=<your_key>
IMAGE_KIT_PRIVATE_KEY=<your_key>
IMAGE_KIT_URL_ENDPOINT=<your_endpoint>
```

**Important:** The backend now supports both `CLIENT_ORIGINS` and `FRONTEND_ORIGINS` for backward compatibility.

## Frontend Static Site (reel-style-food-app.onrender.com)

### Redirects/Rewrites

Add in Dashboard → Redirects/Rewrites:

**Rule 1 (Required):**

- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

### Headers (Optional)

**Rule 1:**

- Path: `/index.html`
- Name: `Cache-Control`
- Value: `no-cache`

**Rule 2:**

- Path: `/assets/*`
- Name: `Cache-Control`
- Value: `public, max-age=31536000, immutable`

## Verification

1. Login as partner → Check cookies in DevTools (should see `partner_token` with `Secure`, `SameSite=None`)
2. POST /api/food → Should return 201 with reel data
3. Refresh /partner/dashboard → Should not 404
4. Network tab → All API responses should have `Access-Control-Allow-Origin` matching frontend origin
