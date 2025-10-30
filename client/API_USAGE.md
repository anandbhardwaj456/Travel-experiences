# API Usage in Frontend

All backend APIs are integrated and actively used in the frontend:

## ✅ Authentication APIs

1. **POST /auth/register**
   - **Location**: `src/context/AuthContext.jsx` (line 50)
   - **Usage**: User registration in Register page
   - **Status**: ✅ Active

2. **POST /auth/login**
   - **Location**: `src/context/AuthContext.jsx` (line 35)
   - **Usage**: User login in Login page and auto-login after registration
   - **Status**: ✅ Active

## ✅ Experience APIs

3. **GET /experiences**
   - **Location**: `src/pages/Experiences.jsx` (line 19)
   - **Usage**: Display all available experiences in the main listing page
   - **Status**: ✅ Active

4. **GET /experiences/:id**
   - **Location**: `src/pages/ExperienceDetail.jsx` (line 27)
   - **Usage**: Get detailed experience information with available slots
   - **Status**: ✅ Active

## ✅ Booking APIs

5. **POST /experiences/bookings**
   - **Location**: `src/pages/ExperienceDetail.jsx` (line 44)
   - **Usage**: Create a new booking with selected slot, name, and email
   - **Status**: ✅ Active

## API Service Layer

All API calls are centralized in `src/services/api.js` with:
- Axios interceptors for automatic token injection
- Error handling for 401 (unauthorized) responses
- Consistent base URL configuration

