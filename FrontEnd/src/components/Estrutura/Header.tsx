import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { i18n, t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    const storedRole = localStorage.getItem('SliderNavigation');
    setUserRole(storedRole);
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };

  const navigationItems = {
    guest: [
      { name: t('header.home'), path: '/' },
      { name: t('header.joinAsNanny'), path: '/register-nanny' },
      { name: t('header.joinAsClient'), path: '/register-client' },
      { name: t('header.contactUs'), path: '/contact-us' },
      { name: t('header.signIn'), path: '/sign-in' },
    ],
    client: [
      { name: t('header.home'), path: '/' },
      { name: t('header.dashboard'), path: '/client-dashboard' },
      { name: t('header.logout'), path: '/logout' },
    ],
    nanny: [
      { name: t('header.home'), path: '/' },
      { name: t('header.dashboard'), path: '/nanny-dashboard' },
      { name: t('header.logout'), path: '/logout' },
    ],
    admin: [
      { name: t('header.home'), path: '/' },
      { name: t('header.logout'), path: '/logout' },
    ],
  };

  const menuItems = navigationItems[userRole] || navigationItems.guest;

  return (
    <header className="bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Express Nannies
            </Link>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 ease-in-out px-3 py-2 text-sm font-medium rounded-md hover:bg-purple-50"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
          {userRole !== 'admin' && (
              <button
                onClick={toggleLanguage}
                className="text-gray-600 hover:text-purple-600 transition-colors duration-200 ease-in-out px-3 py-2 text-sm font-medium rounded-md hover:bg-purple-50"
              >
                {currentLang === 'en' ? 'PT' : 'EN'}
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 ease-in-out"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
