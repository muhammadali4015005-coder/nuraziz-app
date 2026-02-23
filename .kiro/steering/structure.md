# Project Structure

## Root Directory

```
/
├── src/                    # React application source
├── .kiro/                  # Kiro configuration and steering
├── data/                   # File-based storage fallback (auto-generated)
├── dist/                   # Production build output
├── server.js               # Node.js HTTP server
├── db-manager.js           # MongoDB/file storage manager
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

## Source Structure

```
src/
├── main.jsx                # React entry point
├── App.jsx                 # Root component with auth routing
├── App.css                 # Global styles
├── index.css               # Base styles
├── components/             # React components
│   ├── LoginScreen.jsx     # Authentication UI
│   ├── MainScreen.jsx      # Main app container
│   ├── Header.jsx          # Top navigation
│   ├── Sidebar.jsx         # Side navigation menu
│   ├── Toast.jsx           # Toast notifications
│   ├── Notification.jsx    # System notifications
│   └── tabs/               # Feature tabs
│       ├── SettingsTab.jsx
│       ├── GoalsTab.jsx
│       ├── DailyScheduleTab.jsx
│       ├── SchoolTab.jsx
│       ├── WorkTab.jsx
│       ├── FutureTab.jsx
│       ├── SportTab.jsx
│       ├── VideoMaslahatTab.jsx
│       ├── AiNutritionTab.jsx
│       ├── AdminChatTab.jsx
│       ├── AdminDashboard.jsx
│       ├── AdminUsers.jsx
│       ├── AdminPending.jsx
│       ├── AdminDeleted.jsx
│       └── [other tabs...]
└── utils/                  # Utility functions
    ├── toast.js
    ├── showToast.js
    └── customAlert.js
```

## Component Architecture

### Main Flow
1. `App.jsx` - Handles authentication state and routing
2. `LoginScreen.jsx` - User/admin login and registration
3. `MainScreen.jsx` - Tab-based interface with sidebar navigation

### Tab System
- Each feature is a separate tab component in `src/components/tabs/`
- Tabs are dynamically loaded based on user type (regular/admin)
- Admin tabs prefixed with `Admin*`

### State Management
- Local component state with React hooks
- User data passed via props from App → MainScreen → Tabs
- Global toast function in window scope

## Backend Structure

### server.js
- HTTP request routing
- API endpoint handlers
- CORS handling
- Static file serving (limited to allowedFiles list)

### db-manager.js
- MongoDB connection management
- CRUD operations for users and settings
- Automatic fallback to file storage
- ES Module exports

## API Endpoints

All endpoints under `/api/` prefix:

**Authentication**
- POST `/api/register` - User registration
- POST `/api/login` - User login
- POST `/api/admin/login` - Admin login

**User Management**
- POST `/api/save-user` - Save user data
- POST `/api/get-user` - Get user data
- GET `/api/user/:phone` - Get user by phone

**Admin Operations**
- GET `/api/admin/users` - Get all users
- POST `/api/admin/approve` - Approve/reject user
- POST `/api/admin/delete-user` - Soft delete user
- POST `/api/admin/restore-user` - Restore deleted user
- POST `/api/admin/permanent-delete` - Hard delete user
- POST `/api/admin/update-user` - Update user data
- POST `/api/admin/block-subscription` - Block user access
- POST `/api/admin/unblock-subscription` - Unblock user access
- GET `/api/admin/price-settings` - Get pricing
- POST `/api/admin/save-price` - Save price
- POST `/api/admin/save-discount` - Save discount

## Naming Conventions

- **Components**: PascalCase (e.g., `MainScreen.jsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **CSS**: Component-specific CSS files with same name (e.g., `MainScreen.css`)
- **Functions**: camelCase (e.g., `generateGoalDescription()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MONGO_URL`)

## Data Flow

1. User interacts with tab component
2. Component updates local state
3. Component calls API endpoint via fetch
4. Server processes request
5. db-manager handles database operations
6. Response sent back to component
7. Component updates UI with new data
