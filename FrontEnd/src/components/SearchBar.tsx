import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Search handling logic would go here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for nannies..."
          className="w-full px-6 py-4 text-lg rounded-full border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     shadow-sm transition-all duration-300 ease-in-out
                     placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 p-3 bg-blue-500 text-white rounded-full
                     hover:bg-blue-600 transform hover:scale-105
                     transition-all duration-300 ease-in-out
                     shadow-md"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;