# Reelify - Food Reel Social Platform

## Introduction

Reelify is a modern social media platform focused on food content, similar to TikTok but specifically designed for restaurants and food enthusiasts. The platform allows food partners (restaurants) to upload short video reels showcasing their dishes, while users can discover, like, save, and order food directly through the app. The project features real-time interactions, secure authentication, video streaming, order management, and social features like following restaurants and commenting on videos.

## Live Demo Link

🚀 **Live Application**: [https://food-reel-app.vercel.app](https://food-reel-app.vercel.app)  
🔗 **Backend API**: [https://reelify-pr6n.onrender.com](https://reelify-pr6n.onrender.com)

## Resume Review Shortcuts

- [🏗️ Database Architecture](#database-architecture)
- [🔌 API Endpoints](#api-endpoints)
- [⚡ Tech Stack](#tech-stack)
- [📁 Folder Structure](#folder-structure)
- [🛠️ Local Setup](#local-machine-setup)
- [🚀 Deployment](#deployment-steps)

## Features

### Core Features

- **Video Reel Feed**: Infinite scroll feed with single video playback
- **User Authentication**: Separate auth for customers and restaurant partners
- **Food Discovery**: Browse and search food videos by restaurants
- **Social Interactions**: Like, save, comment, and follow restaurants
- **Order Management**: Place orders directly from videos with real-time status updates
- **Restaurant Dashboard**: Upload videos, manage menu, track orders and analytics
- **Real-time Notifications**: Socket.io powered live updates
- **Push Notifications**: Web push notifications for order updates
- **Responsive Design**: Mobile-first design with tablet and desktop support

### Advanced Features

- **CSRF Protection**: Secure cross-origin request handling
- **Image/Video Upload**: ImageKit integration for media management
- **Search & Filters**: Advanced search with text and location-based filtering
- **Review System**: Rate and review completed orders
- **Following System**: Follow favorite restaurants for personalized feed
- **Menu Management**: Restaurant partners can manage their digital menu
- **Order Tracking**: Real-time order status updates with notifications

## Tech Stack

### Frontend

- **React 19** - Modern UI library with latest features
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Socket.io Client** - Real-time communication
- **Vite** - Fast build tool and dev server
- **CSS Modules** - Scoped styling

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **ImageKit** - Media storage and optimization
- **Web Push** - Push notification service

### Security & Middleware

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **CSRF Protection** - Cross-site request forgery protection
- **Express Validator** - Input validation and sanitization

### Deployment & DevOps

- **Render** - Cloud hosting platform
- **Vercel** - Frontend deployment (alternative)
- **MongoDB Atlas** - Cloud database
- **Nodemon** - Development auto-restart

## Database Architecture

```mermaid
erDiagram
    User {
        ObjectId _id PK
        string name
        string email UK
        string password
        string phone
        string address
        Date createdAt
        Date updatedAt
    }

    FoodPartner {
        ObjectId _id PK
        string name
        string email UK
        string password
        string phone
        string address
        string description
        string profileImage
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
        ObjectId partnerId FK
        number likesCount
        number savesCount
        number commentsCount
        Date createdAt
        Date updatedAt
    }

    Order {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId partnerId FK
        array items
        number totalAmount
        string status
        string deliveryAddress
        Date createdAt
        Date updatedAt
    }

    Menu {
        ObjectId _id PK
        ObjectId partnerId FK
        string name
        string description
        number price
        string category
        string image
        boolean available
        Date createdAt
        Date updatedAt
    }

    Like {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId foodId FK
        Date createdAt
    }

    Save {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId foodId FK
        Date createdAt
    }

    Comment {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId foodId FK
        string text
        ObjectId parent FK
        Date createdAt
        Date updatedAt
    }

    CommentLike {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId commentId FK
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
        ObjectId partnerId FK
        number stars
        string comment
        Date createdAt
    }

    Notification {
        ObjectId _id PK
        ObjectId to FK
        string toRole
        string type
        string message
        object data
        Date readAt
        Date createdAt
    }

    Subscription {
        ObjectId _id PK
        ObjectId userId FK
        object subscription
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
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   ├── food.controller.js    # Food video operations
│   │   │   ├── order.controller.js   # Order management
│   │   │   ├── food-partner.controller.js # Restaurant operations
│   │   │   └── ...                   # Other controllers
│   │   ├── models/                   # MongoDB schemas and models
│   │   │   ├── user.model.js         # User schema
│   │   │   ├── food.model.js         # Food video schema
│   │   │   ├── order.model.js        # Order schema
│   │   │   └── ...                   # Other models
│   │   ├── routes/                   # API route definitions
│   │   │   ├── auth.routes.js        # Authentication routes
│   │   │   ├── food.routes.js        # Food-related routes
│   │   │   ├── order.routes.js       # Order routes
│   │   │   └── ...                   # Other routes
│   │   ├── middleware/               # Custom middleware functions
│   │   │   ├── auth.middleware.js    # JWT authentication
│   │   │   ├── csrf.middleware.js    # CSRF protection
│   │   │   └── error.middleware.js   # Error handling
│   │   ├── services/                 # External service integrations
│   │   │   └── push.service.js       # Push notification service
│   │   ├── socket/                   # Real-time communication
│   │   │   └── index.js              # Socket.io configuration
│   │   ├── db/                       # Database configuration
│   │   │   └── db.js                 # MongoDB connection
│   │   └── app.js                    # Express app configuration
│   ├── .env                          # Environment variables
│   ├── package.json                  # Dependencies and scripts
│   └── server.js                     # Application entry point
│
├── Frontend/                         # React Frontend Application
│   ├── src/
│   │   ├── app/                      # App-level components
│   │   │   └── App.jsx               # Main app component
│   │   ├── features/                 # Feature-based modules
│   │   │   ├── auth/                 # Authentication features
│   │   │   │   ├── components/       # Auth-specific components
│   │   │   │   └── pages/            # Login, register pages
│   │   │   ├── home/                 # Home feed features
│   │   │   │   └── pages/            # Home, saved, following pages
│   │   │   ├── video/                # Video player components
│   │   │   │   └── components/       # Video player, controls, actions
│   │   │   ├── foodPartner/          # Restaurant dashboard
│   │   │   │   ├── components/       # Dashboard components
│   │   │   │   └── pages/            # Dashboard pages
│   │   │   ├── orders/               # Order management
│   │   │   │   └── pages/            # Order history, details
│   │   │   ├── checkout/             # Checkout process
│   │   │   │   └── pages/            # Cart, payment pages
│   │   │   └── user/                 # User profile features
│   │   │       └── pages/            # Profile, settings pages
│   │   ├── shared/                   # Shared utilities and components
│   │   │   ├── components/           # Reusable UI components
│   │   │   │   ├── layout/           # Layout components (Navbar, BottomNav)
│   │   │   │   ├── ui/               # UI components (Loading, Modal)
│   │   │   │   └── auth/             # Auth guards (PrivateRoute)
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   │   ├── useVideoPlayer.js # Video playback management
│   │   │   │   └── useVideoActions.js # Video interactions
│   │   │   └── services/             # API service layer
│   │   │       └── api.js            # Axios configuration and API calls
│   │   ├── routes/                   # Routing configuration
│   │   │   ├── AppRouter.jsx         # Main router component
│   │   │   └── routeConfig.js        # Route constants
│   │   └── main.jsx                  # Application entry point
│   ├── public/                       # Static assets
│   │   ├── sw.js                     # Service worker for PWA
│   │   └── default_image.jpeg        # Default images
│   ├── .env                          # Environment variables
│   ├── package.json                  # Dependencies and scripts
│   └── vite.config.js                # Vite configuration
│
├── render.yaml                       # Render deployment configuration
└── README.md                         # Project documentation
```

## API Endpoints

### Authentication

- `POST /api/auth/user/register` - Register new user
- `POST /api/auth/user/login` - User login
- `GET /api/auth/user/logout` - User logout
- `GET /api/auth/user/profile` - Get user profile
- `PATCH /api/auth/user/profile` - Update user profile
- `POST /api/auth/food-partner/register` - Register restaurant partner
- `POST /api/auth/food-partner/login` - Partner login
- `GET /api/auth/food-partner/logout` - Partner logout

### Food & Videos

- `GET /api/food` - Get food video feed
- `POST /api/food` - Upload new food video (Partner only)
- `PATCH /api/food/:id` - Update food video (Partner only)
- `DELETE /api/food/:id` - Delete food video (Partner only)
- `POST /api/food/like` - Like/unlike food video
- `POST /api/food/save` - Save/unsave food video
- `GET /api/food/saved` - Get user's saved videos
- `POST /api/food/comment` - Add comment to video
- `GET /api/food/:foodId/comments` - Get video comments
- `POST /api/food/comment/like` - Like/unlike comment
- `DELETE /api/food/comment/:commentId` - Delete comment

### Food Partners

- `GET /api/food-partner/me` - Get partner profile
- `PATCH /api/food-partner/me` - Update partner profile
- `GET /api/food-partner/me/reels` - Get partner's videos
- `GET /api/food-partner/:id` - Get partner by ID
- `GET /api/food-partner/:id/videos` - Get partner's videos
- `GET /api/food-partner/restaurant/:slug` - Get partner by slug

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/partner/orders` - Get partner's orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/batch/status` - Batch update order status

### Menu Management

- `POST /api/menu` - Create menu item (Partner only)
- `GET /api/menu/me` - Get partner's menu items
- `GET /api/menu/:id` - Get menu items by partner ID
- `PATCH /api/menu/:id` - Update menu item (Partner only)
- `DELETE /api/menu/:id` - Delete menu item (Partner only)

### Social Features

- `POST /api/follow/partner` - Follow/unfollow restaurant
- `GET /api/follow/partners` - Get followed restaurants
- `GET /api/follow/feed` - Get followed restaurants' videos
- `GET /api/follow/count/:partnerId` - Get follower count
- `GET /api/follow/followers` - Get partner's followers

### Reviews

- `POST /api/reviews` - Create review for completed order
- `GET /api/reviews/partner/:id` - Get partner's reviews

### Notifications

- `GET /api/notifications/user` - Get user notifications
- `GET /api/notifications/partner` - Get partner notifications
- `PATCH /api/notifications/user/:id/read` - Mark user notification as read
- `PATCH /api/notifications/partner/:id/read` - Mark partner notification as read

### Utility

- `GET /api/health` - Health check endpoint
- `GET /api/init-csrf` - Initialize CSRF token

## Local Machine Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <project-name>
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

   ```bash
   cp .env.example .env
   ```

   Update `.env` file with your configuration:

   ```env
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=mongodb://localhost:27017/reelify
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reelify

   IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGE_KIT_URL_ENDPOINT=your_imagekit_url_endpoint

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

   ```bash
   cp .env.example .env
   ```

   Update `.env` file:

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

1. Install MongoDB Community Edition
2. Start MongoDB service
3. The application will automatically create the database and collections

**For MongoDB Atlas:**

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string and update `MONGODB_URI` in `.env`
4. Whitelist your IP address in Atlas security settings

## Deployment Steps

### Render Deployment (Recommended)

This project is configured for Render deployment using the included `render.yaml` file.

1. **Prepare for Deployment**

   - Ensure all environment variables are set correctly
   - Update `CLIENT_ORIGINS` in backend `.env` to include your frontend domain
   - Update `VITE_API_URL` in frontend `.env` to point to your backend domain

2. **Deploy to Render**

   - Connect your GitHub repository to Render
   - Render will automatically detect the `render.yaml` configuration
   - Both backend and frontend will be deployed simultaneously
   - Backend will be deployed as a Node.js web service
   - Frontend will be deployed as a static site

3. **Environment Variables Setup**

   - In Render dashboard, configure environment variables for the backend service:
     ```
     JWT_SECRET=your_production_jwt_secret
     MONGODB_URI=your_mongodb_atlas_connection_string
     IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
     IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
     IMAGE_KIT_URL_ENDPOINT=your_imagekit_url_endpoint
     NODE_ENV=production
     CLIENT_ORIGINS=https://your-frontend-domain.onrender.com
     ```

4. **Database Configuration**
   - Use MongoDB Atlas for production database
   - Ensure IP whitelist includes `0.0.0.0/0` for Render servers
   - Update connection string in environment variables

### Alternative Deployment Options

**Backend (Node.js):**

- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

**Frontend (Static Site):**

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Post-Deployment Checklist

1. **Verify API Health**

   - Check `https://your-backend-domain.com/api/health`
   - Should return `{"status": "ok", "timestamp": "..."}`

2. **Test Core Functionality**

   - User registration and login
   - Video upload and playback
   - Order placement and tracking
   - Real-time notifications

3. **Monitor Performance**

   - Check application logs in Render dashboard
   - Monitor database performance in MongoDB Atlas
   - Test mobile responsiveness

4. **Security Verification**
   - Ensure HTTPS is enabled
   - Verify CORS configuration
   - Test CSRF protection
   - Check authentication flows

---

**Built with ❤️ for learning and demonstration purposes**
