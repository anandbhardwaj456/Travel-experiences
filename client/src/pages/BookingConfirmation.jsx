import { useLocation, Link, Navigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const { bookingReference } = location.state || {};

  // Redirect if no booking reference
  if (!bookingReference) {
    return <Navigate to="/experiences" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <img src="/logo.svg" alt="Highway Delite" className="h-8" />
            <button className="px-3 py-1 bg-yellow-400 text-white text-sm font-medium rounded-md">
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Confirmation Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed
          </h1>
          
          {/* Reference Number */}
          <p className="text-gray-600 mb-8">
            Ref ID: {bookingReference}
          </p>

          {/* Back to Home Button */}
          <Link
            to="/experiences"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;