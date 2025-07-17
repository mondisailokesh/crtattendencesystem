# Setup Guide for CRT Attendance System

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (v4.4 or higher)

## MongoDB Setup

### Option 1: Local MongoDB Installation

1. **Download MongoDB Community Server:**
   - Go to https://www.mongodb.com/try/download/community
   - Download the Windows installer
   - Run the installer with default settings

2. **Start MongoDB:**
   - Open Command Prompt as Administrator
   - Run: `net start MongoDB`
   - Or use the provided script: `start-mongodb.bat`

3. **Verify MongoDB is running:**
   - Open a new Command Prompt
   - Run: `mongosh` or `mongo`
   - You should see the MongoDB shell

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account:**
   - Go to https://www.mongodb.com/atlas
   - Sign up for a free account
   - Create a new cluster (free tier)

2. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Create Environment File:**
   - Create a `.env` file in the project root
   - Add: `MONGODB_URI=your_connection_string_here`

## Running the Application

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Application:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend (port 5173)

## Troubleshooting

### MongoDB Connection Issues

If you see `MongoDB connection error: connect ECONNREFUSED ::1:27017`:

1. **Check if MongoDB is running:**
   ```bash
   net start MongoDB
   ```

2. **If MongoDB is not installed:**
   - Follow the installation steps above
   - Or use MongoDB Atlas (cloud option)

3. **If using MongoDB Atlas:**
   - Make sure your IP is whitelisted in Atlas
   - Check your connection string in `.env` file

### Server Crashes

The server will now start even if MongoDB is not connected, but API calls will fail. Make sure MongoDB is running before using the application.

## Default Credentials

After the database is seeded, you can login with any of these faculty accounts:

- **Username:** rajesh.kumar, **Password:** password123
- **Username:** priya.sharma, **Password:** password123
- **Username:** amit.patel, **Password:** password123

## Project Structure

```
project/
├── server/           # Backend API
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Authentication middleware
│   └── utils/        # Utility functions
├── src/              # Frontend
│   ├── js/           # JavaScript files
│   └── styles/       # CSS files
└── index.html        # Main HTML file
``` 