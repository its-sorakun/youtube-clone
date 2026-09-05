#!/bin/bash

echo -e "\033[1;36mSetting up YouTube Clone...\033[0m"

if ! command -v npm &> /dev/null; then
    echo -e "\033[0;31mError: Node.js (npm) is not installed or not in your PATH.\033[0m"
    exit 1
fi

echo -e "\n\033[1;33m[1/4] Cloning repository...\033[0m"
git clone https://github.com/its-sorakun/youtube-clone.git
cd youtube-clone || exit

echo -e "\n\033[1;33m[2/4] Installing frontend dependencies...\033[0m"
npm install

echo -e "\n\033[1;33m[3/4] Installing backend dependencies...\033[0m"
cd backend || exit
npm install

# Check that the user has created .env before proceeding
if [ ! -f ".env" ]; then
    echo -e "\n\033[0;31mError: backend/.env file not found.\033[0m"
    echo -e "Create a .env file inside the backend/ directory with the following variables:"
    echo -e "  PORT=5000"
    echo -e "  MONGODB_URI=mongodb://localhost:27017/ytclone"
    echo -e "  JWT_SECRET=<your_secret_key>"
    echo -e "\nThen re-run this script."
    exit 1
fi

echo -e "\n\033[1;33m[4/4] Seeding MongoDB database...\033[0m"
node seed.js
cd ..

echo -e "\n\033[1;32mSetup complete! Starting servers...\033[0m"
echo -e "\033[0;37mPress Ctrl+C to stop both servers.\033[0m\n"

(cd backend && npm run dev) &
BACKEND_PID=$!

trap "kill $BACKEND_PID 2>/dev/null" EXIT INT TERM

npm run dev
