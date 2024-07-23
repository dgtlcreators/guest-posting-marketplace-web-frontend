import React, { useState } from 'react';

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    minFollowers: '',
    maxFollowers: '',
    minEngagementRate: '',
    maxEngagementRate: '',
    category: '',
    location: '',
    minCollabRate: '',
    maxCollabRate: '',
    verifiedStatus: false,
    language: '',
    recentActivity: false,
    minRating: '',
    maxRating: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(filters);
    onClose();
  };

  return isOpen ? (
    <div className=" inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Filter Influencers</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            {/* Filter fields */}
            <label>
              <span className="text-gray-700">Follower Range</span>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="minFollowers"
                  value={filters.minFollowers}
                  onChange={handleChange}
                  placeholder="Min"
                  className="p-2 border border-gray-300 rounded w-1/2"
                />
                <input
                  type="number"
                  name="maxFollowers"
                  value={filters.maxFollowers}
                  onChange={handleChange}
                  placeholder="Max"
                  className="p-2 border border-gray-300 rounded w-1/2"
                />
              </div>
            </label>
            <label>
              <span className="text-gray-700">Engagement Rate</span>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  name="minEngagementRate"
                  value={filters.minEngagementRate}
                  onChange={handleChange}
                  placeholder="Min"
                  className="p-2 border border-gray-300 rounded w-1/2"
                />
                <input
                  type="number"
                  step="0.01"
                  name="maxEngagementRate"
                  value={filters.maxEngagementRate}
                  onChange={handleChange}
                  placeholder="Max"
                  className="p-2 border border-gray-300 rounded w-1/2"
                />
              </div>
            </label>
            <label>
              <span className="text-gray-700">Category/Niche</span>
              <input
                type="text"
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </label>
            <label>
              <span className="text-gray-700">Location</span>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </label>
            <label>
              <span className="text-gray-700">Collaboration Rates</span>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="minCollabRate"
                  value={filters.minCollabRate}
                  onChange={handleChange}
                  placeholder="Min"
                  className="p-2 border border-gray-300 rounded w-1/2"
                />
                <input
                  type="number"
                  name="maxCollabRate"
                  value={filters.maxCollabRate}
                  onChange={handleChange}
                  placeholder="Max"
                  className="p-2 border border-gray-300 rounded w-1/2"
                />
              </div>
            </label>
            <label>
              <input
                type="checkbox"
                name="verifiedStatus"
                checked={filters.verifiedStatus}
                onChange={handleChange}
                className="mr-2"
              />
              Verified Status
            </label>
            <label>
              <input
                type="checkbox"
                name="recentActivity"
                checked={filters.recentActivity}
                onChange={handleChange}
                className="mr-2"
              />
              Recent Activity
            </label>
            <label>
              <span className="text-gray-700">Language</span>
              <input
                type="text"
                name="language"
                value={filters.language}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </label>
            <label>
              <span className="text-gray-700">Influencer Rating</span>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleChange}
                  placeholder="Min"
                  className="p-2 border border-gray-300 rounded w-1/2"
                />
                <input
                  type="number"
                  step="0.01"
                  name="maxRating"
                  value={filters.maxRating}
                  onChange={handleChange}
                  placeholder="Max"
                  className="p-2 border border-gray-300 rounded w-1/2"
                />
              </div>
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Apply Filters
            </button>
          </div>
        </form>
        <button onClick={onClose} className="mt-4 text-gray-600">
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default FilterModal;
