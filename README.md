# Apple Blog Platform

A modern, feature-rich blogging platform inspired by Medium, built with Next.js, MongoDB, and React.

![Apple Blog Platform](https://placeholder.com/your-screenshot-here)

## Features

### Content Management
- Rich text editor with image uploads, formatting, and embedding
- Draft, scheduled, and published post states
- Categories and tags for content organization
- SEO optimization tools
- Media library for asset management

### User Experience
- Responsive design for all devices
- Dark/light mode support
- Reading progress tracking
- Estimated reading time
- Social sharing capabilities
- Bookmarking functionality
- Follow authors feature
- Personalized content recommendations

### Monetization
- Premium content with subscription model
- M-Pesa integration for mobile payments
- Sponsored content management
- Ad integration (Google Ads)
- Micropayments for individual articles

### Analytics
- Comprehensive dashboard for authors
- Reading statistics and user behavior
- Traffic sources and demographics
- Content performance metrics
- Engagement analytics (likes, comments, shares)

### AI Integration
- AI-assisted content creation
- Automated content suggestions
- Smart categorization of articles
- Personalized recommendation engine

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Shadcn UI Components
- TypeScript

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Integrations
- M-Pesa Payment Gateway
- Google Analytics
- Social Media APIs
- AI Content Generation

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB 5.x or higher
- npm or yarn

### Environment Variables
Create a `.env` file in the server directory with the following variables:

\`\`\`
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_CALLBACK_URL=your_mpesa_callback_url
\`\`\`

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/apple-blog-platform.git
cd apple-blog-platform
\`\`\`

2. Install dependencies for both client and server
\`\`\`bash
# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
\`\`\`

3. Run the development server
\`\`\`bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd ..
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Database Setup

1. Make sure MongoDB is running
2. Seed the database with initial data (optional)
\`\`\`bash
cd server
npm run seed
\`\`\`

## Project Structure

\`\`\`
apple-blog-platform/
├── app/                    # Next.js app directory
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Dashboard routes
│   ├── (main)/             # Main public routes
│   └── api/                # API routes
├── components/             # React components
│   ├── dashboard/          # Dashboard components
│   ├── editor/             # Rich text editor components
│   ├── payment/            # Payment components
│   ├── subscription/       # Subscription components
│   └── ui/                 # UI components (shadcn)
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and services
├── public/                 # Static assets
├── server/                 # Backend server
│   ├── controllers/        # API controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   └── utils/              # Utility functions
└── styles/                 # Global styles
\`\`\`

## API Documentation

The API follows RESTful principles and is organized around resources. All requests and responses are in JSON format.

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Categories & Tags

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create a new tag

### Users

- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Follow System

- `POST /api/follow/:userId` - Follow a user
- `DELETE /api/follow/:userId` - Unfollow a user
- `GET /api/follow/:userId/followers` - Get user's followers
- `GET /api/follow/:userId/following` - Get users followed by user
- `GET /api/follow/:userId/status` - Check follow status

### Recommendations

- `GET /api/recommendations/personalized` - Get personalized recommendations
- `GET /api/recommendations/trending` - Get trending posts
- `GET /api/recommendations/similar/:postId` - Get similar posts

### Analytics

- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/posts/:id` - Get post analytics
- `GET /api/analytics/reading-stats` - Get reading statistics
- `GET /api/analytics/reading-history` - Get reading history

### Payments

- `POST /api/mpesa/stkpush` - Initiate M-Pesa payment
- `GET /api/mpesa/status/:transactionId` - Check payment status
- `POST /api/mpesa/callback` - M-Pesa callback URL

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Server Deployment

1. Set up a MongoDB Atlas cluster
2. Deploy the server to a service like Heroku, Digital Ocean, or AWS
3. Configure environment variables
4. Set up proper CORS configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Express.js](https://expressjs.com/)
\`\`\`

Let's update the server's index.js to include our new routes:
