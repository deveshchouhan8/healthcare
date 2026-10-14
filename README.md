# MediCare – Healthcare Appointment Booking System

## Project Overview
MediCare is a full-stack healthcare appointment booking application that allows patients to register, log in, browse doctors, book appointments, and view their appointment history.

## Features
- Patient registration and login
- Password hashing using bcrypt
- JWT-based authentication using HTTP-only cookies
- Browse doctors
- Book doctor appointments
- View personal appointments
- Logout functionality
- Protected backend API routes
- Responsive frontend UI
- Frontend component testing with Jest and React Testing Library

## Technologies Used

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- Jest
- React Testing Library

**Backend**
- Node.js
- Express.js
- MySQL
- JWT
- bcryptjs

## Project Structure
```text
healthcare/
├── frontend/
├── backend/
├── .gitignore
└── README.md
```

## Local Setup

### 1. Clone the repository
```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd healthcare
```

### 2. Install frontend dependencies
```bash
cd frontend
npm install
```

### 3. Install backend dependencies
```bash
cd ../backend
npm install
```

### 4. Configure environment variables
Create a `.env` file inside the `backend` folder and configure your local MySQL database credentials and JWT secret.

Never commit your real `.env` file to GitHub.

### 5. Run the application

Start MySQL using XAMPP.

In one terminal:
```bash
cd backend
node server.js
```

In another terminal:
```bash
cd frontend
npm run dev
```

Open http://localhost:3000 in your browser.

## Run Frontend Tests
```bash
cd frontend
npm test -- --runInBand
```

## Future Improvements
- Automated backend API tests
- Deployment to a hosting platform
- Improved appointment management