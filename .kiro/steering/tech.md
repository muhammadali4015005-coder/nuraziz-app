# Technology Stack

## Frontend

- **Framework**: React 18.2.0 with Vite 5.0.0
- **Language**: JavaScript (JSX)
- **Styling**: CSS modules and inline styles
- **Icons**: lucide-react 0.564.0
- **Build Tool**: Vite with Terser minification

## Backend

- **Runtime**: Node.js (>=16.0.0)
- **Server**: Native HTTP server (no Express)
- **Database**: MongoDB 5.9.0 with file-based fallback
- **Module System**: ES Modules (type: "module")

## Development Setup

### Prerequisites
- Node.js 16+
- MongoDB (optional, falls back to file storage)

### Common Commands

```bash
# Development (runs both server and Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run server only
npm run server
# or
npm start
```

### Ports

- **Frontend (Vite)**: http://localhost:5174
- **Backend (Node)**: http://localhost:5003
- **MongoDB**: mongodb://localhost:27017

### API Proxy

Vite dev server proxies `/api/*` requests to backend server (localhost:5003).

## Database

- **Primary**: MongoDB (nuraziz_db database)
- **Collections**: users, settings
- **Fallback**: JSON files in `./data/` directory
- **Connection**: Auto-reconnect with 5s timeout

## Build Configuration

- Output directory: `dist/`
- Source maps: Disabled in production
- Minification: Terser
- Dev server auto-opens browser on start
