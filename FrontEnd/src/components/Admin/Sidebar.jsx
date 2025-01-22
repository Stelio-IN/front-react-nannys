import React from 'react';

import { Home, Users, Calendar, Settings } from 'lucide-react';

const Sidebar = ({ selectedTab, onSelectTab }) => {
  return (
    <nav className="fixed left-0 top-0 h-full w-16 bg-white shadow-lg flex flex-col items-center py-8 space-y-8">
      <button onClick={() => onSelectTab('dashboard')} className={`h-6 w-6 ${selectedTab === 'dashboard' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}>
        <Home />
      </button>
      <button onClick={() => onSelectTab('babas')} className={`h-6 w-6 ${selectedTab === 'babas' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}>
        <Users />
      </button>
      <button onClick={() => onSelectTab('reservas')} className={`h-6 w-6 ${selectedTab === 'reservas' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}>
        <Calendar />
      </button>
      <button onClick={() => onSelectTab('pagamentos')} className={`h-6 w-6 ${selectedTab === 'pagamentos' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}>
        <Settings />
      </button>
    </nav>
  );
};

export default Sidebar;