import React from 'react';
import { Star, Heart, MapPin, Clock, Award, Phone } from 'lucide-react';

const NannyCard = ({ nanny = {} }) => {
  const {
    name = 'Name Not Available',
    photo = "../assets/white1.jpg",
    experience = 0,
    rating = 0,
    location = 'Location Not Available',
    availableFrom = '9AM',
    availableTo = '5PM',
    hourlyRate = 0,
    languages = [],
    specialties = []
  } = nanny;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-102 transition-all duration-300">
      {/* Top Section with Photo and Quick Actions */}
      <div className="relative">
        <img
          src={photo}
          alt={name}
          className="w-full h-60 object-cover"
        />
        <button 
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200"
          aria-label="Save to favorites"
        >
          <Heart className="w-5 h-5 text-rose-500" />
        </button>
        {rating > 0 && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{name}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-500" />
            <span className="text-sm">{experience} years exp.</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="text-sm">{availableFrom}-{availableTo}</span>
          </div>
        </div>

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <span 
                  key={lang}
                  className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Specialties */}
        {specialties.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {specialties.map(specialty => (
                <span 
                  key={specialty}
                  className="px-2 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price and Contact */}
        <div className="flex items-center justify-between mt-6">
          <div>
            <span className="text-2xl font-bold text-gray-800">${hourlyRate}</span>
            <span className="text-gray-500 text-sm">/hour</span>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <Phone className="w-4 h-4" />
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default NannyCard;