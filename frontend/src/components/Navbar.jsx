import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // You can replace this with your logout API logic
    // For now, just redirect to homepage
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Center: Navigation Links */}
      <div className="space-x-6 text-sm sm:text-base">
        <Link
          to="/dashboard"
          className="hover:text-pink-300 transition"
        >
          {t('dashboard')}
        </Link>

        <Link
          to="/profile"
          className="hover:text-pink-300 transition"
        >
          {t('profile')}
        </Link>

        <Link
          to="/leaderboard"
          className="hover:text-pink-300 transition"
        >
          {t('view_leaderboard') || 'View Leaderboard'}
        </Link>
      </div>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        className="bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded text-white text-sm transition"
      >
        {t('logout')}
      </button>
    </nav>
  );
}
