import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { experienceAPI } from '../services/api';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const data = await experienceAPI.getById(id);
      setExperience(data);

      if (data.availableDates && data.availableDates.length > 0) {
        setSelectedDate(data.availableDates[0].date || data.availableDates[0]);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  };

  const formatTimeLabel = (timeStr) => {
    if (!timeStr) return '';
    if (/am|pm/i.test(timeStr)) return timeStr;
    const [h, m] = timeStr.split(':').map((x) => parseInt(x, 10));
    const ampm = h >= 12 ? 'pm' : 'am';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12.toString().padStart(2, '0')}:${(m || 0)
      .toString()
      .padStart(2, '0')} ${ampm}`;
  };

  const subtotal = (experience?.price || 0) * quantity;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    navigate('/checkout', {
      state: { experience, selectedDate, selectedTime, quantity },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Experience not found</p>
          <Link
            to="/experiences"
            className="text-yellow-600 hover:text-yellow-700 font-semibold"
          >
            ← Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/experiences"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="ml-2 font-medium">Details</span>
            </Link>

            <img src="/logo.svg" alt="Highway Delite" className="h-8" />

            <div className="flex items-center gap-2 w-64">
              <input
                type="text"
                placeholder=" "
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="px-4 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image + Details */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden shadow-sm mb-6">
             <img
                src={`http://localhost:5000${experience.image}`}
                alt={experience.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-placeholder.png'; // or your own file in public/
                   }}
               />           
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {experience.title || 'Experience'}
            </h1>
            <p className="text-gray-600 mb-6">
              {experience.description ||
                'Curated small-group experience. Certified guide. Safety first with gear included.'}
            </p>

            {/* Date Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Choose date
              </h3>
              <div className="flex flex-wrap gap-3">
                {experience.availableDates?.length ? (
                  experience.availableDates.map((dateObj, idx) => {
                    const dateStr =
                      typeof dateObj === 'string' ? dateObj : dateObj.date;
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={dateStr || idx}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`${
                          isSelected
                            ? 'bg-yellow-400 text-black'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } px-3 py-2 rounded-md text-sm font-medium`}
                      >
                        {formatDateLabel(dateStr)}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No dates available</p>
                )}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Choose time
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(experience.availableTimes || [
                    '07:00',
                    '09:00',
                    '11:00',
                    '13:00',
                  ]).map((time, idx) => {
                    const timeStr = typeof time === 'string' ? time : time.time;
                    const isSelected = selectedTime === timeStr;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedTime(timeStr)}
                        className={`${
                          isSelected
                            ? 'bg-yellow-400 text-black'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } px-3 py-2 rounded-md text-sm font-medium`}
                      >
                        {formatTimeLabel(timeStr)}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  All times are in IST (GMT +5:30)
                </p>
              </div>
            )}

            {/* About Section */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">About</h3>
              <div className="bg-gray-100 text-gray-700 rounded-md px-4 py-3 text-sm">
                Scenic routes, trained guides, and safety briefing. Minimum age 10.
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <aside className="bg-gray-100 rounded-xl p-6 h-fit">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Starts at</span>
                <span className="font-medium">₹{experience.price || 999}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">₹{taxes}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-sm font-semibold">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime}
                className="w-full mt-2 bg-yellow-400 text-black py-2.5 rounded-md font-medium hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ExperienceDetail;
