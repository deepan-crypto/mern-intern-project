# Plant Watering & Fertilizing Tracker (MERN Stack)

A simple plant tracking application built with React, Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14+)
- MongoDB (running locally or set MONGO_URI in environment)
- npm

## Project Structure

```
final-project/
├── backend/          # Express.js + MongoDB backend
├── frontend/         # React + Vite frontend
└── README.md
```

## Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on **http://localhost:5000**

   Make sure MongoDB is running locally (default: mongodb://127.0.0.1:27017/mern_intern)

## Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on **http://localhost:5173** (or the next available port)

## Running the Full App

**Important:** You must start the backend FIRST, then the frontend.

### Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```

### Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 in your browser.

## Common Issues

### "401 Unauthorized" Error
- Your session token has expired or is invalid
- Solution: Log out and log back in
- The app will automatically log you out if the token is invalid

### "Cannot connect to backend server" Error
- Make sure backend is running: `cd backend && npm run dev`
- Backend must be on port 5000
- Check that MongoDB is running

### "No routes matched location" Error
- Make sure you're clicking links to navigate between pages
- Don't manually type routes in the URL bar
- Use the navbar to navigate

### Port 5000 Already in Use
- Kill the process: `npx kill-port 5000`
- Or change MONGO_URI/PORT in backend if needed

### Token Expires After Browser Close
- Tokens are stored in localStorage and persist across sessions
- If you experience 401 errors, try logging out and back in
- Clear browser cache if issues persist

---

**Note:** This is a beginner-friendly project. For production use, consider adding JWT refresh tokens, better validation, and security measures.
