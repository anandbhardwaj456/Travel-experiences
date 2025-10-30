import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience, selectedDate, selectedTime, quantity } = location.state || {};
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Redirect if no booking data
  useEffect(() => {
    if (!experience || !selectedDate || !selectedTime) {
      navigate('/experiences');
    }
  }, [experience, selectedDate, selectedTime, navigate]);

  if (!experience) {
    return null;
  }

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    
    try {
      setLoading(true);
      const response = await bookingAPI.validatePromo(promoCode);
      if (response.valid) {
        setPromoApplied(true);
        setError('');
      } else {
        setError('Invalid promo code');
      }
    } catch (err) {
      setError('Failed to apply promo code');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName || !email) {
      setError('Please fill in all required fields');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the terms and safety policy');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const bookingPayload = {
           experienceId: experience?._id, // ensure MongoDB ObjectId is used
           date: new Date(selectedDate).toISOString().split('T')[0], // normalize to YYYY-MM-DD
           time: selectedTime?.trim(),
           quantity: parseInt(quantity || 1, 10),
           fullName: fullName.trim(),
           email: email.trim(),
           ...(promoApplied && promoCode ? { promoCode } : {})
          };

      console.log("📦 Sending booking payload:", bookingPayload);

      const response = await bookingAPI.create(bookingPayload);
      
      navigate('/booking-confirmation', { 
        state: { 
          bookingReference: response.bookingReference,
          experience: response.experience
        }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = experience?.price || 999;
  const taxes = Math.round(subtotal * 0.05) || 59;
  const total = subtotal + taxes;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/experiences" className="flex items-center text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span className="ml-2 font-medium">Checkout</span>
            </Link>
            <img src="/logo.svg" alt="Highway Delite" className="h-8" />
            <button className="px-4 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition">
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Promo code
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    id="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter promo code"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={!promoCode || loading}
                    className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-5">
                  I agree to the terms and safety policy
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !termsAccepted}
                className="w-full bg-yellow-400 text-black py-4 rounded-lg font-semibold hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </form>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Experience</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium text-gray-900">{experience?.name || 'Kayaking'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', {
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit'
                  }).replace(/\//g, '-') : '2025-10-22'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time</span>
                <span className="font-medium text-gray-900">{selectedTime || '09:00 am'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Qty</span>
                <span className="font-medium text-gray-900">{quantity || 1}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium text-gray-900">₹{taxes}</span>
                </div>
                
                <div className="flex justify-between items-center text-lg font-semibold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;