import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {

    localStorage.clear();
    window.location.reload();

    navigate('/sign-in');
  }, [navigate]);

  return null; // O componente não precisa renderizar nada visível
};

export default Logout;
