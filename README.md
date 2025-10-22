# 🍔 Reel-Style Food App

A full-stack MERN application that combines social media-style video reels with food ordering. Users can discover restaurants through short-form video content, place orders, and interact with food partners in real-time.

## 🚀 Live Demo

- **Frontend:** [https://reel-style-food-app.onrender.com](https://reel-style-food-app.onrender.com)
- **Backend API:** [https://reelify-pr6n.onrender.com](https://reelify-pr6n.onrender.com)

## ✨ Features

### User Features
- 📱 TikTok-style vertical video feed for food discovery
- ❤️ Like, save, and comment on food reels
- 🛒 Add items to cart and place orders
- 🔔 Real-time order status updates via WebSocket
- 👤 Follow favorite food partners
- 📦 Order history and tracking
- 🔐 Secure authentication with HTTP-only cookies

### Food Partner Features
- 🎥 Upload video reels to showcase dishes
- 📋 Manage menu items and pricing
- 📊 Dashboard for order management
- 🔄 Real-time order notifications
- 👥 View follower count and engagement
- ✏️ Edit and delete reels
- 📈 Track likes, saves, and comments

### Technical Features
- 🔒 CSRF protection with double-submit cookie pattern
- 🌐 Cross-origin authentication with SameSite cookies
- ⚡ Real-time updates using Socket.IO
- 🎨 Responsive design with CSS Modules
- 🔐 Helmet.js security headers
- 📦 Image/video uploads via ImageKit CDN
- 🔄 Optimistic UI updates

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.1.1
- **Routing:** React Router DOM 7.8.2
- **HTTP Client:** Axios 1.11.0
- **Real-time:** Socket.IO Client 4.8.1
- **Build Tool:** Vite 7.1.2
- **Styling:** CSS Modules

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5.1.0
- **Database:** MongoDB with Mongoose 8.18.0
- **Authentication:** JWT (jsonwebtoken 9.0.2) + bcryptjs 3.0.2
- **Real-time:** Socket.IO 4.8.1
- **File Upload:** Multer 2.0.2
- **Storage:** ImageKit 6.0.0
- **Security:** Helmet 8.0.0, CORS 2.8.5, Custom CSRF middleware
- **Push Notifications:** Web Push 3.6.7

## 📁 Folder Structure

```
Reel-Style-Food-App/
├── Backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, CSRF, error handling
│   │   ├── services/         # Business logic (storage, push)
│   │   ├── socket/           # WebSocket handlers
│   │   ├── db/               # Database connection
│   │   └── app.js            # Express app configuration
│   ├── server.js             # Entry point
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── app/              # App root component
│   │   ├── features/         # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── checkout/     # Cart and checkout
│   │   │   ├── foodPartner/  # Partner dashboard
│   │   │   ├── home/         # Feed and saved items
│   │   │   ├── orders/       # Order management
│   │   │   ├── user/         # User profile
│   │   │   └── video/        # Video player components
│   │   ├── routes/           # Route configuration
│   │   ├── shared/           # Shared utilities
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── contexts/     # React contexts
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── services/     # API services
│   │   │   └── realtime/     # Socket.IO client
│   │   └── assets/           # Global styles
│   ├── public/               # Static assets
│   └── package.json
└── render.yaml               # Render deployment config
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance
- ImageKit account (for media storage)

### Backend Setup

```bash
cd Backend
npm install

# Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGINS=http://localhost:5173
NODE_ENV=development
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
IMAGE_KIT_URL_ENDPOINT=your_imagekit_url_endpoint
EOF

npm start
```

### Frontend Setup

```bash
cd Frontend
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:3000/api
EOF

npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key` |
| `CLIENT_ORIGINS` | Allowed CORS origins (comma-separated) | `https://app.com,http://localhost:5173` |
| `NODE_ENV` | Environment | `production` or `development` |
| `IMAGE_KIT_PUBLIC_KEY` | ImageKit public key | `public_xxx` |
| `IMAGE_KIT_PRIVATE_KEY` | ImageKit private key | `private_xxx` |
| `IMAGE_KIT_URL_ENDPOINT` | ImageKit CDN endpoint | `https://ik.imagekit.io/xxx` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://api.example.com/api` |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/user/register` | Register new user | ❌ |
| POST | `/api/auth/user/login` | User login | ❌ |
| GET | `/api/auth/user/logout` | User logout | ✅ |
| GET | `/api/auth/user/profile` | Get user profile | ✅ |
| PATCH | `/api/auth/user/profile` | Update user profile | ✅ |
| POST | `/api/auth/food-partner/register` | Register food partner | ❌ |
| POST | `/api/auth/food-partner/login` | Partner login | ❌ |
| GET | `/api/auth/food-partner/logout` | Partner logout | ✅ |

### Food Reels
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/food` | Get food reels feed | ❌ |
| POST | `/api/food` | Create food reel | ✅ Partner |
| PATCH | `/api/food/:id` | Update food reel | ✅ Partner |
| DELETE | `/api/food/:id` | Delete food reel | ✅ Partner |
| POST | `/api/food/like` | Like/unlike food reel | ✅ User |
| POST | `/api/food/save` | Save/unsave food reel | ✅ User |
| GET | `/api/food/saved` | Get saved reels | ✅ User |

### Comments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/food/comment` | Add comment | ✅ User |
| GET | `/api/food/:foodId/comments` | Get comments | ✅ User |
| DELETE | `/api/food/comment/:commentId` | Delete comment | ✅ User |
| POST | `/api/food/comment/like` | Like/unlike comment | ✅ User |

### Food Partners
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/food-partner/:id` | Get partner by ID | ❌ |
| GET | `/api/food-partner/restaurant/:slug` | Get partner by slug | ❌ |
| GET | `/api/food-partner/:id/videos` | Get partner videos | ❌ |
| GET | `/api/food-partner/me` | Get my profile | ✅ Partner |
| PATCH | `/api/food-partner/me` | Update my profile | ✅ Partner |
| GET | `/api/food-partner/me/reels` | Get my reels | ✅ Partner |

### Menu
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/menu` | Create menu item | ✅ Partner |
| GET | `/api/menu/me` | Get my menu items | ✅ Partner |
| GET | `/api/menu/:id` | Get partner menu | ❌ |
| PATCH | `/api/menu/:id` | Update menu item | ✅ Partner |
| DELETE | `/api/menu/:id` | Delete menu item | ✅ Partner |

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create order | ✅ User |
| GET | `/api/orders/user` | Get user orders | ✅ User |
| GET | `/api/orders/:id` | Get order by ID | ✅ User |
| GET | `/api/orders/partner/orders` | Get partner orders | ✅ Partner |
| PATCH | `/api/orders/:id/status` | Update order status | ✅ Partner |
| PATCH | `/api/orders/batch/status` | Batch update orders | ✅ Partner |

### Reviews
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reviews` | Create review | ✅ User |
| GET | `/api/reviews/partner/:id` | Get partner reviews | ❌ |

### Follow
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/follow/partner` | Follow/unfollow partner | ✅ User |
| GET | `/api/follow/count/:partnerId` | Get follower count | ❌ |
| GET | `/api/follow/partners` | Get followed partners | ✅ User |
| GET | `/api/follow/feed` | Get followed feed | ✅ User |
| GET | `/api/follow/followers` | Get my followers | ✅ Partner |

### Notifications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications/user` | Get user notifications | ✅ User |
| GET | `/api/notifications/partner` | Get partner notifications | ✅ Partner |
| PATCH | `/api/notifications/user/:id/read` | Mark user notification read | ✅ User |
| PATCH | `/api/notifications/partner/:id/read` | Mark partner notification read | ✅ Partner |

### Push Notifications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/push/subscribe` | Subscribe to push notifications | ✅ User |

### Health Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | API health check | ❌ |
| GET | `/healthz` | Server health check | ❌ |

## 🚀 Deployment

### Render Configuration

**Backend (Web Service):**
- Build Command: `cd Backend && npm install`
- Start Command: `cd Backend && npm start`
- Environment: Node
- Add all environment variables from Backend .env

**Frontend (Static Site):**
- Build Command: `cd Frontend && npm install && npm run build`
- Publish Directory: `Frontend/dist`
- Add Rewrite Rule: `/*` → `/index.html`
- Add Header: `/index.html` → `Cache-Control: no-cache`
- Add Header: `/assets/*` → `Cache-Control: public, max-age=31536000, immutable`

### Important Notes
- Set `CLIENT_ORIGINS` in backend to include frontend URL
- Enable "Auto-Deploy" for automatic deployments on push
- Backend must be HTTPS for cross-origin cookies to work
- Service worker requires HTTPS in production

## 🔮 Future Improvements

- [ ] Search and filter functionality for restaurants
- [ ] Advanced analytics dashboard for partners
- [ ] In-app messaging between users and partners
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA) features
- [ ] Video compression and optimization
- [ ] Recommendation algorithm based on user preferences
- [ ] Social sharing features
- [ ] Admin panel for platform management
- [ ] Email notifications
- [ ] Rating and review system enhancements
- [ ] Delivery tracking with maps integration
- [ ] Loyalty points and rewards system

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Contact

**Developer:** Your Name
- GitHub: [@yourusername](https://github.com/tanim-mishkat)
- LinkedIn: [Your Name](https://linkedin.com/in/md-tanimur-rahman-mishkat)
- Email: your.email@example.com

## 🙏 Acknowledgments

- ImageKit for media CDN
- Render for hosting
- MongoDB Atlas for database
- Socket.IO for real-time features
- React and Express communities

---

⭐ Star this repo if you find it helpful!
