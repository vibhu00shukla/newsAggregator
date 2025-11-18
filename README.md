# AI News Aggregator

A modern, personalized news aggregation platform that delivers curated news articles based on user preferences. Built with a robust backend and an intuitive React frontend.

**Live Demo**: [https://ai-news-aggregator-1-r8or.onrender.com/](https://ai-news-aggregator-1-r8or.onrender.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Available Categories](#available-categories)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

AI News Aggregator is a full-stack web application that aggregates news from multiple sources and presents them in a personalized feed. Users can create accounts, set their preferences, and receive news tailored to their interests. The application uses AI-powered scheduling to fetch and categorize the latest news articles continuously.

## ✨ Features

### Backend Features
- ✅ **User Authentication & Authorization** - Secure JWT-based auth system
- ✅ **Personalized News Feed** - Articles filtered by user preferences
- ✅ **Category Management** - 8 different news categories
- ✅ **Token Blacklisting** - Secure logout functionality
- ✅ **Automated News Scheduling** - Cron jobs for continuous news fetching
- ✅ **Password Security** - bcrypt hashing for secure password storage
- ✅ **CORS Support** - Cross-origin request handling

### Frontend Features
- ✅ **User Authentication** - Login and signup with validation
- ✅ **Personalized Dashboard** - Custom news feed based on preferences
- ✅ **Category Selection** - Easy preference setup and management
- ✅ **Article Details** - View full article information and external links
- ✅ **Settings Management** - Update profile and preferences
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Real-time Updates** - Dynamic news feed updates

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Task Scheduling**: node-cron
- **HTTP Client**: Axios
- **API Validation**: express-validator
- **Middleware**: CORS, Cookie Parser

### Frontend
- **Library**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Routing**: React Router DOM 7.6.3
- **HTTP Client**: Axios
- **UI Icons**: Lucide React
- **Styling**: CSS3
- **Linting**: ESLint 9.30.1

## 📁 Project Structure

```
newsAggregator/
├── AI_NEWS_AGGREGATOR/
│   ├── Backend/
│   │   ├── controllers/          # Request handlers for API endpoints
│   │   ├── db/                   # Database configuration
│   │   ├── middleware/           # Custom middleware (auth, validation)
│   │   ├── models/               # Mongoose schemas (User, Article, etc.)
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Business logic (scheduler, user service)
│   │   ├── app.js                # Express app configuration
│   │   ├── server.js             # Server entry point
│   │   ├── package.json          # Backend dependencies
│   │   └── .env                  # Environment variables
│   │
│   └── Frontend/
│       ├── src/
│       │   ├── components/       # React components (Login, Feed, etc.)
│       │   ├── context/          # Context API (UserContext, NewsProvider)
│       │   ├── assets/           # Static assets
│       │   ├── App.jsx           # Main App component
│       │   └── main.jsx          # React entry point
│       ├── vite.config.js        # Vite configuration
│       ├── eslint.config.js      # ESLint configuration
│       ├── package.json          # Frontend dependencies
│       └── index.html            # HTML template
│
└── README.md                     # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn package manager

### Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd AI_NEWS_AGGREGATOR/Backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` File**
   Create a `.env` file in the Backend directory with the following variables:
   ```env
   PORT=3000
   DB_CONNECT=mongodb://localhost:27017/ai_news_aggregator
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   NEWS_API_KEY=your_news_api_key
   GROK_API_KEY=your_grok_api_key
   ```

   **Environment Variables Explanation**:
   - `PORT`: Server port (default: 3000)
   - `DB_CONNECT`: MongoDB connection string
   - `JWT_SECRET`: Secret key for signing JWT tokens
   - `NODE_ENV`: Application environment (development/production)
   - `NEWS_API_KEY`: API key for fetching news articles
   - `GROK_API_KEY`: API key for article categorization/processing

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd AI_NEWS_AGGREGATOR/Frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure API Endpoint** (if needed)
   Update the API base URL in your components if it differs from `http://localhost:3000`

## 🏃 Running the Project

### Development Mode

**Terminal 1 - Backend**
```bash
cd AI_NEWS_AGGREGATOR/Backend
npm start
```
Backend runs on: `http://localhost:3000`

**Terminal 2 - Frontend**
```bash
cd AI_NEWS_AGGREGATOR/Frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Production Build

**Frontend Build**
```bash
cd AI_NEWS_AGGREGATOR/Frontend
npm run build
```

## 🔌 API Endpoints

### User Routes (`/user`)

#### Register User
```
POST /user/register
Content-Type: application/json

{
  "name": "string (min 3 chars)",
  "email": "valid@email.com",
  "password": "string (min 6 chars)",
  "categories": ["Technology", "Business"]
}
```
**Response**: `{ user, token }`

#### Login User
```
POST /user/login
Content-Type: application/json

{
  "email": "user@email.com",
  "password": "password123"
}
```
**Response**: `{ user, token }`

#### Get User Profile
```
GET /user/profile
Authorization: Bearer <token>
```
**Response**: User profile object

#### Update Profile
```
PUT /user/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name",
  "categories": ["Finance", "Technology"],
  "oldPassword": "current_password",
  "newPassword": "new_password"
}
```
**Response**: Updated user object

#### Get Personalized News Feed
```
GET /user/news
Authorization: Bearer <token>
```
**Response**: Array of articles matching user categories

#### Logout User
```
GET /user/logout
Authorization: Bearer <token>
```
**Response**: Success message

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for secure authentication. Tokens are included in:

1. **Cookie**: `token` - Automatically sent with requests
2. **Authorization Header**: `Bearer <token>`

### Token Blacklisting
Tokens are blacklisted on logout for security. Blacklisted tokens cannot be used for authentication.

## 📰 Available Categories

The platform supports the following news categories:

- Technology
- Business
- Entertainment
- Environment
- Finance
- Smart Home
- Social Media
- Retail

Users can select multiple categories during registration and update them in settings.

## ⚙️ Configuration

### Backend Configuration

**Database Connection**:
- Local MongoDB: `mongodb://localhost:27017/ai_news_aggregator`
- MongoDB Atlas: `mongodb+srv://user:password@cluster.mongodb.net/ai_news_aggregator`

**JWT Configuration**:
- Set a strong `JWT_SECRET` in production
- Tokens are valid for the duration specified in your implementation

**News Scheduling**:
- Scheduled jobs run at configured intervals
- Fetches and categorizes news articles automatically
- Updates database with latest articles

### Frontend Configuration

**API Base URL**:
Configure in your API client setup if not using `http://localhost:3000`

## 📦 Deployment

The application is deployed on Render. To deploy your own instance:

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables in Render dashboard:
   - `PORT`
   - `DB_CONNECT`
   - `JWT_SECRET`
   - `NODE_ENV`
   - `NEWS_API_KEY`
   - `GROK_API_KEY`
4. Deploy with start command: `npm start`

### Frontend Deployment (Render/Vercel)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API endpoint to point to deployed backend

## 🧪 Testing

### Manual Testing

1. **Register a New User**
   - Go to signup page
   - Select preferred categories
   - Register and verify login

2. **Test News Feed**
   - Login with test credentials
   - Check if news feed displays articles from selected categories
   - Update categories in settings and verify feed updates

3. **API Testing**
   - Use Postman or similar tools
   - Test endpoints with provided authentication tokens

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: vibhu00shukla@gmail.com

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Guide](https://jwt.io/)
- [Vite Guide](https://vitejs.dev/)

## 📊 Project Stats

- **Frontend**: React with Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Deployment**: Render
- **API Authentication**: JWT

---

**Happy Coding! 🚀**

If you find this project helpful, please give it a star ⭐
