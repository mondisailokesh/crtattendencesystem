@echo off
echo Starting MongoDB...
echo.
echo If MongoDB is not installed, please:
echo 1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
echo 2. Install it with default settings
echo 3. Make sure the MongoDB service is running
echo.
echo Alternatively, you can use MongoDB Atlas (cloud):
echo 1. Go to https://www.mongodb.com/atlas
echo 2. Create a free cluster
echo 3. Get your connection string
echo 4. Create a .env file with: MONGODB_URI=your_connection_string
echo.
echo Attempting to start MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is not installed or not in PATH
    echo Please install MongoDB Community Server
    pause
    exit /b 1
)

echo MongoDB found. Starting server...
mongod --dbpath ./data/db
pause 