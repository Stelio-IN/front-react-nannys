import React, { useState } from 'react';
import { ChevronDown, Users, Calendar, Baby, Search, Clock } from 'lucide-react';

const FindNanny = () => {
  const [children, setChildren] = useState(1);
  const [selectedAges, setSelectedAges] = useState([]);
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const ageGroups = [
    { id: 'babies', label: 'Babies (0-12 months)', icon: <Baby size={20} /> },
    { id: 'toddlers', label: 'Toddlers (1-3 yrs)', icon: <Baby size={20} /> },
    { id: 'children', label: 'Children (4-11 yrs)', icon: <Users size={20} /> },
    { id: 'teenagers', label: 'Teenagers (12+)', icon: <Users size={20} /> }
  ];

  const handleAgeGroupToggle = (group) => {
    setSelectedAges(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Find Your Perfect Nanny
        </h1>
        <p className="text-gray-500">Tell us about your childcare needs</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Children
            </label>
            <div className="flex items-center bg-gray-100 rounded-lg">
              <button 
                onClick={() => setChildren(Math.max(1, children - 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-l-lg"
              >
                -
              </button>
              <span className="px-4 text-lg font-semibold">{children}</span>
              <button 
                onClick={() => setChildren(children + 1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-r-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex-grow relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="flex items-center">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-grow relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="flex items-center">
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-grow relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <div className="flex items-center">
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Clock className="absolute right-3 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex-grow relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <div className="flex items-center">
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Clock className="absolute right-3 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Children's Ages
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ageGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleAgeGroupToggle(group.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedAges.includes(group.id) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {group.icon}
                <span>{group.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Children with Special Needs
          </label>
          <div className="flex space-x-4">
            <button 
              onClick={() => setSpecialNeeds(true)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                specialNeeds === true 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Yes
            </button>
            <button 
              onClick={() => setSpecialNeeds(false)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                specialNeeds === false 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests / Preferences
          </label>
          <textarea 
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Language preferences, qualifications, allergies, routines, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>

        <button 
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Search size={20} />
          <span>Find Nannies</span>
        </button>
      </div>
    </div>
  );
};

export default FindNanny;