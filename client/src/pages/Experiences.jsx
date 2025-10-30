import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { experienceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = experiences.filter(
        (exp) =>
          exp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExperiences(filtered);
    } else {
      setFilteredExperiences(experiences);
    }
  }, [searchTerm, experiences]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await experienceAPI.getAll();
      setExperiences(data);
      setFilteredExperiences(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <img src="/logo.svg" alt="Highway Delite" className="h-8" />

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <button
                className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition"
                onClick={() => fetchExperiences()}
              >
                Search
              </button>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {filteredExperiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? 'No experiences found matching your search.'
                : 'No experiences available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredExperiences.map((experience) => (
              <Link
                key={experience._id}
                to={`/experiences/${experience._id}`}
                className="bg-gray-100 rounded-xl overflow-hidden group hover:shadow-lg transition-shadow"
              >
                {/* Experience Image */}
                <div className="h-48 relative overflow-hidden">
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

                {/* Experience Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition">
                      {experience.title}
                    </h3>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {experience.location || 'Unknown'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {experience.description?.slice(0, 60) ||
                      'Curated small-group experience. Certified guide. Safety first.'}
                    ...
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">
                      From ₹{experience.price || 999}
                    </span>
                    <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Experiences;
