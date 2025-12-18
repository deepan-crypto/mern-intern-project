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

### "Cannot connect to backend server" Error
- Make sure backend is running: `cd backend && npm run dev`
- Backend must be on port 5000
- Check that MongoDB is running

### "No routes matched location" Error
- Make sure you're clicking the Edit button from the Plant Details page
- Don't navigate directly to /edit without a plant ID

### Port 5000 Already in Use
- Kill the process: `npx kill-port 5000`
- Or change MONGO_URI/PORT in backend if needed

## Features

✅ User Authentication (Login/Register with JWT)
✅ Add, Edit, Delete Plants
✅ Track Watering & Fertilizing Schedules
✅ Activity History with Filtering
✅ Overdue Task Alerts
✅ Plant Image Upload
✅ Responsive Design

## Pages

- **Dashboard** - View all plants with stats
- **Add Plant** - Create new plant tracker
- **Plant Details** - View full plant info and history
- **Edit Plant** - Update plant information
- **Activities** - View and filter activity history
- **Login/Register** - User authentication

---

**Note:** This is a beginner-friendly project. For production use, consider adding JWT refresh tokens, better validation, and security measures.
