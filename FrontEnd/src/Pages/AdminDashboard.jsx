import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import Header from '../components/Admin/Header';
import Dashboard from '../components/Admin/Dashboard';
import BabasList from '../components/Admin/BabasList';
import ReservasList from '../components/Admin/ReservasList';
import PaymentList from '../components/Admin/PaymentsList';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o adminToken existe no localStorage
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      // Redireciona para a página de erro (/*)
      navigate('/*');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar selectedTab={selectedTab} onSelectTab={setSelectedTab} />

      <main className="ml-16 p-8">
        <Header />

        {selectedTab === 'dashboard' && <Dashboard />}
        {selectedTab === 'babas' && <BabasList />}
        {selectedTab === 'reservas' && <ReservasList />}
        {selectedTab === 'pagamentos' && <PaymentList />}
      </main>
    </div>
  );
};

export default AdminDashboard;
