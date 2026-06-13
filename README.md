# Digital Menu Card Web Application

A full-stack Digital Menu Card built using React, Node.js, Express.js, and MongoDB.

## Project Structure

- `frontend/` - React Application (Vite)
- `backend/` - Node.js & Express API

## Setup Instructions

### 1. Database Setup
Make sure MongoDB is installed and running locally on port `27017` (or change `MONGO_URI` in `backend/.env`).

### 2. Backend Setup
```bash
cd backend
npm install
npm run start # or node server.js
```
The backend server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory and add the following:
```env
VITE_API_BASE_URL=https://digital-menu-card-one.vercel.app/api
```
Then run the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### 4. Initializing the Admin User
To log in, you first need to create an admin user. You can do this by sending a POST request to `http://localhost:5000/api/auth/setup` with the following JSON payload using Postman or cURL:
```json
{
  "username": "admin",
  "password": "password123"
}
```

After setup, you can visit `/admin` in the browser to log in with these credentials.
