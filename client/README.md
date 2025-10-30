# Bookit Frontend

A responsive React application for booking experiences.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Features

- User authentication (Login/Register)
- Browse available experiences
- View experience details with available time slots
- Book experiences with slot selection
- Responsive design for mobile, tablet, and desktop

## API Integration

All backend APIs are integrated:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /experiences` - Get all experiences
- `GET /experiences/:id` - Get experience details with slots
- `POST /experiences/bookings` - Create a booking

## Technologies

- React 18
- React Router DOM
- Tailwind CSS
- Axios
- Vite

