# PrintSync - Smart Online Printing Marketplace

## 🎯 Project Overview

PrintSync is a comprehensive online printing marketplace that connects customers with local printing shops. The system features role-based authentication, real-time shop discovery with map integration, and a modern, premium user interface.

---

## 🏗️ Architecture Summary

### Backend (Django + GraphQL)

#### **Authentication System**
- **Framework**: Django 4.2 with GraphQL (Graphene-Django)
- **Auth Method**: JWT-based authentication using `django-graphql-jwt`
- **User Model**: Custom email-based authentication (no username)
- **Roles**: CUSTOMER, SHOP_OWNER, ADMIN
- **Subscription Tiers**: FREE, STUDENT, BUSINESS

#### **Key Features**
1. **SafeJSONWebTokenMiddleware**: Custom middleware that gracefully handles malformed JWT tokens
2. **Standardized Responses**: Uses `tarxemo_django_graphene_utils` for consistent API responses
3. **CORS Configuration**: Properly configured for frontend (localhost:5173)
4. **Security**: Password validation, JWT expiration, refresh tokens

#### **GraphQL Schema**

**Mutations:**
- `registerUser`: Create new user account (CUSTOMER or SHOP_OWNER)
- `tokenAuth`: Login and receive JWT token
- `verifyToken`: Verify JWT token validity
- `refreshToken`: Refresh expired JWT token

**Queries:**
- `me`: Get current authenticated user
- `users`: Admin-only query to list all users
- `shops`: Get nearby shops with geolocation filtering

---

### Frontend (React + TypeScript + Vite)

#### **Tech Stack**
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4 with custom design system
- **State Management**: Zustand with persistence
- **GraphQL Client**: Apollo Client 4
- **Forms**: React Hook Form + Zod validation
- **Maps**: Leaflet + React-Leaflet
- **Icons**: Lucide React
- **Routing**: React Router DOM 7

#### **Design System**

**Color Palette:**
```css
Brand Colors:
- 50:  #f0f4ff (lightest)
- 100: #e0e7ff
- 500: #6366f1 (primary)
- 600: #4f46e5
- 700: #4338ca
- 900: #312e81 (darkest)
```

**Design Features:**
- ✨ Glassmorphism effects
- 🎨 Gradient backgrounds
- 🌊 Smooth animations (fade-in, slide-in, float)
- 📱 Fully responsive design
- 🎯 Premium, modern aesthetics
- 🔄 Micro-interactions and hover effects

#### **Key Components**

**UI Components:**
- `Button`: Multi-variant button with loading states
- `Input`: Form input with error handling
- `Card`: Container with header, content, footer
- `Select`: Dropdown with consistent styling

**Feature Components:**
- `LoginPage`: Email/password authentication
- `RegisterPage`: User registration with role selection
- `CustomerDashboard`: Shop discovery with map/list views
- `ShopDashboard`: Shop owner dashboard with stats and orders
- `ShopCard`: Shop listing card
- `ShopMap`: Interactive Leaflet map

---

## 🔐 Authentication Flow

### Registration
1. User fills registration form (email, password, role, phone)
2. Frontend validates with Zod schema
3. GraphQL mutation `registerUser` creates user
4. Backend validates role (only CUSTOMER or SHOP_OWNER allowed)
5. User redirected to login page

### Login
1. User enters email and password
2. Frontend sends `tokenAuth` mutation
3. Backend validates credentials
4. JWT token and refresh token returned
5. User data stored in Zustand + localStorage
6. Apollo Client configured with JWT in Authorization header
7. User redirected to role-specific dashboard

### Protected Routes
- Routes wrapped with `ProtectedRoute` component
- Checks authentication status
- Validates user role
- Redirects unauthorized users

---

## 📁 Project Structure

```
stationary_backend/
├── stationary_accounts/      # User authentication
│   ├── models.py             # Custom User model
│   ├── schema.py             # GraphQL schema
│   └── middleware.py         # JWT middleware
├── stationary_shops/          # Shop management
├── stationary_orders/         # Order processing
├── stationary_storage/        # File storage
├── stationary_geo/            # Geolocation services
└── stationary_config/         # Django settings

stationary_frontend/
├── src/
│   ├── components/ui/        # Reusable UI components
│   ├── features/             # Feature-specific code
│   │   ├── auth/            # Authentication
│   │   └── shops/           # Shop discovery
│   ├── pages/               # Page components
│   │   ├── auth/            # Login, Register
│   │   └── dashboard/       # Customer, Shop dashboards
│   ├── stores/              # Zustand state management
│   ├── lib/                 # Utilities, Apollo client
│   └── layouts/             # Layout components
```

---

## 🚀 Getting Started

### Backend Setup

```bash
cd stationary_backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend runs on: `http://localhost:8000`
GraphQL endpoint: `http://localhost:8000/graphql/`

### Frontend Setup

```bash
cd stationary_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🎨 Design Highlights

### Customer Dashboard
- **Dual View Mode**: Toggle between list and full-map views
- **Real-time Search**: Filter shops as you type
- **Geolocation**: Find shops within radius
- **Interactive Map**: Leaflet integration with markers
- **Glassmorphism**: Modern frosted glass effects
- **Smooth Animations**: Staggered slide-in animations

### Shop Dashboard
- **Statistics Cards**: Total orders, revenue, customers
- **Recent Orders**: Real-time order tracking
- **Tabbed Navigation**: Overview, Orders, Analytics
- **Status Badges**: Visual order status indicators
- **Quick Actions**: Fast access to common tasks
- **Gradient Accents**: Premium visual hierarchy

### Authentication Pages
- **Clean Forms**: Minimal, focused design
- **Validation**: Real-time error feedback
- **Loading States**: Visual feedback during API calls
- **Smooth Transitions**: Fade and slide animations

---

## 🔧 Configuration

### Environment Variables

**Backend** (`settings.py`):
```python
SECRET_KEY = "your-secret-key"
DEBUG = True
ALLOWED_HOSTS = []
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

**Frontend** (`apollo/client.ts`):
```typescript
const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql/',
});
```

---

## 📊 Current Status

### ✅ Completed Features
- [x] User authentication (register, login)
- [x] JWT token management
- [x] Role-based access control
- [x] Protected routes
- [x] Customer dashboard with shop discovery
- [x] Shop dashboard with statistics
- [x] Modern, premium UI design
- [x] Responsive layouts
- [x] Form validation
- [x] State persistence

### 🚧 In Progress / Next Steps
- [ ] Shop profile management
- [ ] Order creation and tracking
- [ ] File upload for print jobs
- [ ] Payment integration
- [ ] Real-time notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Email verification
- [ ] Password reset

---

## 🎯 Key Differentiators

1. **Premium Design**: Modern glassmorphism, gradients, and animations
2. **Type Safety**: Full TypeScript implementation
3. **Scalable Architecture**: Clean separation of concerns
4. **Standardized Responses**: Consistent API response format
5. **Error Handling**: Graceful JWT error handling
6. **User Experience**: Smooth transitions and micro-interactions
7. **Accessibility**: Semantic HTML and ARIA labels

---

## 📝 API Examples

### Register User
```graphql
mutation RegisterUser {
  registerUser(
    email: "user@example.com"
    password: "securepassword"
    role: "CUSTOMER"
    phoneNumber: "+1234567890"
  ) {
    response {
      status
      message
    }
    user {
      id
      email
      role
    }
  }
}
```

### Login
```graphql
mutation Login {
  tokenAuth(email: "user@example.com", password: "securepassword") {
    token
    refreshToken
    user {
      id
      email
      role
      isVerified
    }
    response {
      status
      message
    }
  }
}
```

### Get Current User
```graphql
query Me {
  me {
    id
    email
    role
    subscriptionTier
    isVerified
  }
}
```

---

## 🛠️ Development Tips

1. **Backend**: Use Django admin for quick data management
2. **Frontend**: Use React DevTools and Apollo DevTools
3. **Styling**: Leverage Tailwind's utility classes and custom CSS variables
4. **State**: Zustand DevTools for debugging state
5. **GraphQL**: Use GraphiQL interface at `/graphql/` for testing

---

## 📚 Dependencies

### Backend
- Django 4.2
- graphene-django
- django-graphql-jwt
- django-cors-headers
- tarxemo-django-graphene-utils

### Frontend
- React 19
- TypeScript 5.9
- Vite 7
- Apollo Client 4
- Zustand 5
- React Hook Form 7
- Zod 4
- Tailwind CSS 3.4
- Leaflet 1.9
- Lucide React

---

## 🎓 Learning Resources

- [Django GraphQL Tutorial](https://docs.graphene-python.org/projects/django/en/latest/)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [Zustand Guide](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)

---

## 📄 License

This project is part of a coding practice exercise.

---

**Built with ❤️ using Django, GraphQL, React, and TypeScript**
