import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-9xl font-extrabold text-indigo-600 select-none">404</h1>
      <p className="text-2xl font-semibold text-gray-800 mt-4">
        Oops! Page not found.
      </p>
      <p className="text-gray-600 mt-2 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-8 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default Error404;
