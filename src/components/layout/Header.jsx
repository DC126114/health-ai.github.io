import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首頁' },
    { path: '/symptom-check', label: '症狀檢查' },
    { path: '/ask-ai', label: 'AI 百科' },
  ];

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="text-lg font-semibold text-primary-color">
            兒童健康助手
          </Link>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-gray-600 hover:text-blue-600 ${
                    location.pathname === item.path ? 'text-blue-600 font-semibold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 