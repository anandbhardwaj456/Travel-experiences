import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/experiences"
            element={
              <ProtectedRoute>
                <Experiences />
              </ProtectedRoute>
            }
          />
          <Route
            path="/experiences/:id"
            element={
              <ProtectedRoute>
                <ExperienceDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-confirmation"
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/experiences" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

