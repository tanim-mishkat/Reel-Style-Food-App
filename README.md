# Reelify - Food Reel Social Platform

## Introduction

Reelify is a social media platform built for food content, similar to TikTok but made specifically for restaurants and food lovers. Restaurants can upload short video reels showing off their dishes, while users can browse, like, save, and order food right from the app. The platform includes real-time interactions, secure authentication, video streaming, order management, and social features like following restaurants and commenting on videos.

## Live Demo Link

🔗 **Live Application**: [https://reel-style-food-app.onrender.com/](https://reel-style-food-app.onrender.com/)  

## Resume Review Shortcuts

- [🏗️ Database Architecture](#database-architecture)
- [🔌 API Endpoints](#api-endpoints)
- [⚡ Tech Stack](#tech-stack)
- [📁 Folder Structure](#folder-structure)
- [🛠️ Local Setup](#local-machine-setup)
- [🚀 Deployment](#deployment-steps)

## Features

### Core Features

- **Video Reel Feed**: Infinite scroll feed with single video playback at a time
- **User Authentication**: Separate authentication systems for customers and restaurant partners
- **Food Discovery**: Browse and search food videos by restaurants
- **Social Interactions**: Like, save, comment with threaded replies, and follow restaurants
- **Order Management**: Place orders directly from videos with real-time status tracking
- **Restaurant Dashboard**: Upload videos, manage menu items, track orders and view followers
- **Real-time Notifications**: Socket.io powered live updates for orders and interactions
- **Push Notifications**: Web push notifications for order status updates
- **Responsive Design**: Mobile-first design that works on tablets and desktops

### Advanced Features

- **CSRF Protection**: Secure cross-site request forgery protection with token management
- **Image/Video Upload**: ImageKit integration for media storage and optimization
- **Search & Filters**: Filter orders by status, reels by availability
- **Review System**: Rate completed orders with star ratings
- **Following System**: Follow favorite restaurants for a personalized feed
- **Menu Management**: Restaurant partners can create and manage their digital menu
- **Order Tracking**: Real-time order status updates with timeline tracking
- **Comment System**: Threaded comments with like functionality on videos

## Tech Stack

### Frontend

- **React 19** - Latest version of React with modern features
- **React Router DOM v7** - Client-side routing with nested routes
- **Axios** - HTTP client with request/response interceptors
- **Socket.io Client** - Real-time bidirectional communication
- **Vite** - Lightning-fast build tool and development server
- **CSS Modules** - Component-scoped styling

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js v5** - Web application framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling with schema validation
- **Socket.io** - Real-time event-based communication
- **JWT** - Stateless authentication with JSON Web Tokens
- **bcryptjs** - Secure password hashing
- **Multer** - Multipart form data handling for file uploads
- **ImageKit** - Cloud-based media storage and CDN
- **Web Push** - Push notification service for browsers

### Security & Middleware

- **Helmet** - HTTP security headers
- **CORS** - Cross-origin resource sharing configuration
- **CSRF Protection** - Custom CSRF middleware with token validation
- **Cookie Parser** - Parse and manage HTTP cookies
- **Express Validator** - Request validation and sanitization

### Deployment & DevOps

- **Render** - Cloud platform for backend hosting
- **Vercel** - Frontend deployment platform
- **MongoDB Atlas** - Cloud-hosted MongoDB database
- **Nodemon** - Auto-restart development server

## Database Architecture

```mermaid
erDiagram
    User {
        ObjectId _id PK
        string fullName
        string email UK
        string password
        Date createdAt
        Date updatedAt
    }

    FoodPartner {
        ObjectId _id PK
        string fullName
        string email UK
        string password
        string contactName
        string phone
        string address
        string profileImg
        string slug UK
        Date createdAt
        Date updatedAt
    }

    Food {
        ObjectId _id PK
        string name
        string description
        string video
        number price
        ObjectId foodPartner FK
        number likesCount
        number savedCount
        number commentsCount
        object prepTime
        boolean isAvailable
        string photoUrl
        object tags
        Date createdAt
        Date updatedAt
    }

    Order {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId restaurantId FK
        array items
        object fulfillment
        object payment
        string status
        array timeline
        Date createdAt
        Date updatedAt
    }

    Menu {
        ObjectId _id PK
        ObjectId foodPartner FK
        string name
        string description
        number price
        object prepTime
        boolean isAvailable
        string photoUrl
        object tags
        Date createdAt
        Date updatedAt
    }

    Like {
        ObjectId _id PK
        ObjectId user FK
        ObjectId food FK
        Date createdAt
    }

    Save {
        ObjectId _id PK
        ObjectId user FK
        ObjectId food FK
        Date createdAt
    }

    Comment {
        ObjectId _id PK
        ObjectId user FK
        ObjectId food FK
        string text
        ObjectId parent FK
        number likesCount
        number repliesCount
        Date createdAt
        Date updatedAt
    }

    CommentLike {
        ObjectId _id PK
        ObjectId user FK
        ObjectId comment FK
        Date createdAt
    }

    Follow {
        ObjectId _id PK
        ObjectId user FK
        ObjectId partner FK
        Date createdAt
    }

    Review {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId orderId FK
        ObjectId restaurantId FK
        number stars
        Date createdAt
    }

    Notification {
        ObjectId _id PK
        ObjectId to FK
        string toRole
        string type
        object payload
        Date deliveredAt
        Date readAt
        Date createdAt
    }

    Subscription {
        ObjectId _id PK
        ObjectId userId FK
        string endpoint
        object keys
        Date createdAt
    }

    User ||--o{ Order : places
    User ||--o{ Like : creates
    User ||--o{ Save : creates
    User ||--o{ Comment : writes
    User ||--o{ CommentLike : creates
    User ||--o{ Follow : follows
    User ||--o{ Review : writes
    User ||--o{ Notification : receives
    User ||--o{ Subscription : has

    FoodPartner ||--o{ Food : uploads
    FoodPartner ||--o{ Order : receives
    FoodPartner ||--o{ Menu : manages
    FoodPartner ||--o{ Follow : followed_by
    FoodPartner ||--o{ Review : receives
    FoodPartner ||--o{ Notification : receives

    Food ||--o{ Like : receives
    Food ||--o{ Save : receives
    Food ||--o{ Comment : receives

    Comment ||--o{ CommentLike : receives
    Comment ||--o{ Comment : parent_of

    Order ||--o{ Review : generates
```

## Folder Structure

```
├── Backend/                          # Node.js Backend Application
│   ├── src/
│   │   ├── controllers/              # Request handlers and business logic
│   │   │   ├── auth.controller.js    # User and partner authentication
│   │   │   ├── food.controller.js    # Food video CRUD and interactions
│   │   │   ├── order.controller.js   # Order creation and management
│   │   │   ├── food-partner.controller.js # Restaurant profile operations
│   │   │   ├── menu.controller.js    # Menu item management
│   │   │   ├── follow.controller.js  # Follow/unfollow functionality
│   │   │   ├── review.controller.js  # Review creation and retrieval
│   │   │   ├── notification.controller.js # Notification management
│   │   │   └── push.controller.js    # Push notification subscriptions
│   │   ├── models/                   # MongoDB schemas and models
│   │   │   ├── user.model.js         # User schema
│   │   │   ├── foodpartner.model.js  # Food partner schema
│   │   │   ├── food.model.js         # Food video schema
│   │   │   ├── order.model.js        # Order schema with timeline
│   │   │   ├── menu.model.js         # Menu item schema
│   │   │   ├── comment.model.js      # Comment schema with threading
│   │   │   ├── commentLike.model.js  # Comment like schema
│   │   │   ├── likes.model.js        # Food like schema
│   │   │   ├── save.model.js         # Saved food schema
│   │   │   ├── follow.model.js       # Follow relationship schema
│   │   │   ├── review.model.js       # Review schema
│   │   │   ├── notification.model.js # Notification schema
│   │   │   └── subscription.model.js # Push subscription schema
│   │   ├── routes/                   # API route definitions
│   │   │   ├── auth.routes.js        # Authentication endpoints
│   │   │   ├── food.routes.js        # Food video endpoints
│   │   │   ├── order.routes.js       # Order endpoints
│   │   │   ├── food-partner.routes.js # Partner profile endpoints
│   │   │   ├── menu.routes.js        # Menu management endpoints
│   │   │   ├── follow.routes.js      # Follow system endpoints
│   │   │   ├── review.routes.js      # Review endpoints
│   │   │   ├── notification.routes.js # Notification endpoints
│   │   │   └── push.routes.js        # Push notification endpoints
│   │   ├── middleware/               # Custom middleware functions
│   │   │   ├── auth.middleware.js    # JWT authentication for users and partners
│   │   │   ├── optional-auth.middleware.js # Optional authentication
│   │   │   ├── csrf.middleware.js    # CSRF token generation and validation
│   │   │   └── error.middleware.js   # Global error handling
│   │   ├── services/                 # External service integrations
│   │   │   ├── push.service.js       # Web push notification service
│   │   │   └── storage.service.js    # ImageKit file upload service
│   │   ├── socket/                   # Real-time communication
│   │   │   └── index.js              # Socket.io server configuration
│   │   ├── db/                       # Database configuration
│   │   │   └── db.js                 # MongoDB connection setup
│   │   └── app.js                    # Express app configuration
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment variables template
│   ├── package.json                  # Dependencies and scripts
│   └── server.js                     # Application entry point
│
├── Frontend/                         # React Frontend Application
│   ├── src/
│   │   ├── app/                      # App-level components
│   │   │   └── App.jsx               # Main app component with routing
│   │   ├── features/                 # Feature-based modules
│   │   │   ├── auth/                 # Authentication features
│   │   │   │   ├── components/       # Login/register forms
│   │   │   │   └── pages/            # Auth pages for users and partners
│   │   │   ├── home/                 # Home feed features
│   │   │   │   └── pages/            # Home, saved, following pages
│   │   │   ├── video/                # Video player components
│   │   │   │   └── components/       # Player, controls, actions, comments
│   │   │   ├── foodPartner/          # Restaurant dashboard
│   │   │   │   ├── components/       # Dashboard tabs and components
│   │   │   │   ├── pages/            # Dashboard, profile, reels pages
│   │   │   │   ├── hooks/            # Dashboard custom hooks
│   │   │   │   └── utils/            # Formatting utilities
│   │   │   ├── orders/               # Order management
│   │   │   │   └── pages/            # Order history and details
│   │   │   ├── checkout/             # Checkout process
│   │   │   │   └── pages/            # Cart and payment pages
│   │   │   └── user/                 # User profile features
│   │   │       └── pages/            # User dashboard page
│   │   ├── shared/                   # Shared utilities and components
│   │   │   ├── components/           # Reusable UI components
│   │   │   │   ├── layout/           # Navbar, BottomNav
│   │   │   │   ├── ui/               # Button, Input, Loading, Toast, etc.
│   │   │   │   └── auth/             # PrivateRoute, PartnerPrivateRoute
│   │   │   ├── contexts/             # React contexts
│   │   │   │   └── CartContext.jsx   # Shopping cart state management
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   │   ├── useVideoPlayer.js # Video playback management
│   │   │   │   ├── useVideoActions.js # Video interactions (like, save)
│   │   │   │   ├── useCart.js        # Cart operations
│   │   │   │   ├── useRealtime.js    # Socket.io connection
│   │   │   │   └── useFollowerCount.js # Follower count tracking
│   │   │   ├── realtime/             # Real-time communication
│   │   │   │   └── socket.js         # Socket.io client setup
│   │   │   └── services/             # API service layer
│   │   │       ├── api.js            # Axios configuration and all API calls
│   │   │       ├── follow.service.js # Follow-related API calls
│   │   │       └── push.js           # Push notification setup
│   │   ├── routes/                   # Routing configuration
│   │   │   ├── AppRouter.jsx         # Main router with all routes
│   │   │   └── routeConfig.js        # Route path constants
│   │   ├── assets/                   # Static assets
│   │   │   └── styles/               # Global CSS and variables
│   │   └── main.jsx                  # Application entry point
│   ├── public/                       # Public static files
│   │   ├── sw.js                     # Service worker for PWA
│   │   ├── default_image.jpeg        # Default placeholder image
│   │   └── _redirects                # Netlify/Vercel redirect rules
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment variables template
│   ├── package.json                  # Dependencies and scripts
│   └── vite.config.js                # Vite build configuration
│
├── render.yaml                       # Render deployment configuration
└── README.md                         # Project documentation
```

## API Endpoints

### Authentication

- `POST /api/auth/user/register` - Register new user account
- `POST /api/auth/user/login` - User login with credentials
- `GET /api/auth/user/logout` - User logout and clear session
- `GET /api/auth/user/profile` - Get authenticated user profile
- `PATCH /api/auth/user/profile` - Update user profile information
- `POST /api/auth/food-partner/register` - Register restaurant partner account
- `POST /api/auth/food-partner/login` - Partner login with credentials
- `GET /api/auth/food-partner/logout` - Partner logout and clear session

### Food & Videos

- `GET /api/food` - Get paginated food video feed
- `POST /api/food` - Upload new food video (Partner only, requires video file)
- `PATCH /api/food/:id` - Update food video details (Partner only)
- `DELETE /api/food/:id` - Delete food video (Partner only)
- `POST /api/food/like` - Toggle like on food video
- `POST /api/food/save` - Toggle save on food video
- `GET /api/food/saved` - Get user's saved videos
- `POST /api/food/comment` - Add comment to video (supports threaded replies)
- `GET /api/food/:foodId/comments` - Get all comments for a video
- `POST /api/food/comment/like` - Toggle like on comment
- `DELETE /api/food/comment/:commentId` - Delete own comment

### Food Partners

- `GET /api/food-partner/me` - Get authenticated partner profile
- `PATCH /api/food-partner/me` - Update partner profile
- `GET /api/food-partner/me/reels` - Get partner's own videos
- `GET /api/food-partner/:id` - Get partner profile by ID
- `GET /api/food-partner/:id/videos` - Get partner's public videos
- `GET /api/food-partner/restaurant/:slug` - Get partner by unique slug

### Orders

- `POST /api/orders` - Create new order from cart
- `GET /api/orders/user` - Get user's order history
- `GET /api/orders/partner/orders` - Get partner's received orders (with optional status filter)
- `GET /api/orders/:id` - Get specific order details
- `PATCH /api/orders/:id/status` - Update single order status (Partner only)
- `PATCH /api/orders/batch/status` - Batch update multiple order statuses (Partner only)

### Menu Management

- `POST /api/menu` - Create new menu item (Partner only)
- `GET /api/menu/me` - Get partner's own menu items
- `GET /api/menu/:id` - Get menu items by partner ID (public)
- `PATCH /api/menu/:id` - Update menu item (Partner only)
- `DELETE /api/menu/:id` - Delete menu item (Partner only)

### Social Features

- `POST /api/follow/partner` - Toggle follow/unfollow restaurant
- `GET /api/follow/partners` - Get list of followed restaurants
- `GET /api/follow/feed` - Get video feed from followed restaurants
- `GET /api/follow/count/:partnerId` - Get follower count for a partner
- `GET /api/follow/followers` - Get partner's follower list (Partner only)

### Reviews

- `POST /api/reviews` - Create review for completed order
- `GET /api/reviews/partner/:id` - Get all reviews for a partner

### Notifications

- `GET /api/notifications/user` - Get user notifications
- `GET /api/notifications/partner` - Get partner notifications
- `PATCH /api/notifications/user/:id/read` - Mark user notification as read
- `PATCH /api/notifications/partner/:id/read` - Mark partner notification as read

### Push Notifications

- `POST /api/push/subscribe` - Subscribe to push notifications

### Utility

- `GET /api/health` - Health check endpoint
- `GET /api/init-csrf` - Initialize CSRF token

## Local Machine Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git
- ImageKit account (for media storage)

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Reel-Style-Food-App
   ```

2. **Navigate to Backend directory**

   ```bash
   cd Backend
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Environment Configuration**

   Create a `.env` file in the Backend directory:

   ```env
   JWT_SECRET=your_jwt_secret_key_here
   MONGODB_URI=mongodb://localhost:27017/reelify
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reelify

   IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGE_KIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

   PORT=3000
   NODE_ENV=development
   CLIENT_ORIGINS=http://localhost:5173
   ```

5. **Start the backend server**

   ```bash
   npm start
   ```

   The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to Frontend directory**

   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the Frontend directory:

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

### Database Setup

**For Local MongoDB:**

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: MongoDB runs as a service automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. The application will automatically create the database and collections on first run

**For MongoDB Atlas (Recommended for Production):**

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Get the connection string from the "Connect" button
5. Update `MONGODB_URI` in `.env` with your connection string
6. Add your IP address to the IP whitelist in Atlas security settings

### ImageKit Setup

1. Create a free account at [imagekit.io](https://imagekit.io)
2. Get your credentials from the Dashboard:
   - Public Key
   - Private Key
   - URL Endpoint
3. Update the ImageKit variables in your backend `.env` file

## Deployment Steps

### Render Deployment (Recommended)

This project is configured for Render deployment using the included `render.yaml` file.

1. **Prepare for Deployment**

   - Create accounts on [Render](https://render.com) and [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Set up ImageKit account for media storage
   - Push your code to a GitHub repository

2. **Deploy to Render**

   - Connect your GitHub repository to Render
   - Render will automatically detect the `render.yaml` configuration
   - Both backend and frontend will be deployed simultaneously
   - Backend deploys as a Node.js web service
   - Frontend deploys as a static site

3. **Environment Variables Setup**

   In Render dashboard, configure these environment variables for the backend service:

   ```
   JWT_SECRET=your_production_jwt_secret_minimum_32_characters
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reelify
   IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGE_KIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   NODE_ENV=production
   CLIENT_ORIGINS=https://your-frontend-domain.onrender.com,https://food-reel-app.vercel.app
   PORT=3000
   ```

4. **Frontend Environment Variables**

   Update your frontend `.env.production` file:

   ```
   VITE_API_URL=https://your-backend-domain.onrender.com/api
   ```

5. **Database Configuration**

   - Use MongoDB Atlas for production database
   - In Atlas, go to Network Access and add `0.0.0.0/0` to allow Render servers
   - Copy the connection string and update `MONGODB_URI` in Render environment variables

### Alternative Deployment Options

**Backend (Node.js):**

- Heroku - Easy deployment with Git push
- Railway - Modern platform with automatic deployments
- DigitalOcean App Platform - Managed container platform
- AWS Elastic Beanstalk - Scalable AWS deployment

**Frontend (Static Site):**

- Vercel - Automatic deployments from Git (recommended for Vite)
- Netlify - Continuous deployment with form handling
- GitHub Pages - Free hosting for static sites
- AWS S3 + CloudFront - Scalable CDN distribution

### Post-Deployment Checklist

1. **Verify API Health**

   - Visit `https://your-backend-domain.com/api/health`
   - Should return: `{"status": "ok", "timestamp": "2024-..."}`

2. **Test Core Functionality**

   - User registration and login
   - Partner registration and login
   - Video upload and playback
   - Like, save, and comment on videos
   - Add items to cart and place order
   - Order status updates
   - Real-time notifications
   - Follow/unfollow restaurants

3. **Monitor Performance**

   - Check application logs in Render dashboard
   - Monitor database performance in MongoDB Atlas
   - Test on mobile devices for responsiveness
   - Check video loading times

4. **Security Verification**

   - Verify HTTPS is enabled on both frontend and backend
   - Test CORS configuration with actual domains
   - Verify CSRF protection is working
   - Test authentication flows for both users and partners
   - Check that JWT tokens are properly set in HTTP-only cookies

5. **Production Optimizations**

   - Enable gzip compression on backend
   - Set up CDN for static assets
   - Configure proper cache headers
   - Set up error monitoring (e.g., Sentry)
   - Configure backup strategy for MongoDB

---
