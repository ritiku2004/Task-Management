# Task Management Project

A full-stack task management application built with Node.js (Express) for the backend and React (Vite + Tailwind CSS) for the frontend.

## Features
- User authentication (register, login)
- Create, update, delete, and view tasks
- Pagination for task lists
- Responsive UI with Tailwind CSS
- RESTful API backend

## Technologies Used
### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT Authentication

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB (local or cloud)

### Backend Setup
1. Navigate to the backend folder:
   ```powershell
   cd Backend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Configure MongoDB connection in `config/db.js`.
4. Start the backend server:
   ```powershell
   node server.js
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```powershell
   cd Frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the frontend development server:
   ```powershell
   npm run dev
   ```

## Folder Structure
```
Backend/
  controllers/
  middleware/
  models/
  routes/
  config/
Frontend/
  src/
    api/
    components/
    pages/
  public/
```

## API Endpoints
- `/api/tasks` - CRUD operations for tasks
- `/api/users` - User registration & authentication

## License
This project is licensed under the MIT License.
