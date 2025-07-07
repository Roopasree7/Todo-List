import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Flame, Star, Languages, Upload, LogOut, Trash2 } from 'lucide-react';
import i18n from '../i18n';
import Leaderboard from '../components/Leaderboard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Import the backend URL from Vite environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Profile({ setLanguage, user, setUser }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    setLanguage(lang);
    toast.success(t('language_changed') || 'Language changed!');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      toast.success(t('avatar_updated') || 'Avatar updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(t('delete_confirm') || 'Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      // ✅ Use full backend URL
      await axios.delete(`${BACKEND_URL}/api/tasks/${taskId}`, { withCredentials: true });
      toast.success(t('task_deleted') || 'Task deleted successfully');

      if (setUser) {
        setUser(prev => ({
          ...prev,
          tasks: prev.tasks.filter(task => task.id !== taskId),
        }));
      }
    } catch (err) {
      console.error('Failed to delete task', err);
      toast.error(t('delete_failed') || 'Failed to delete task');
    }
  };

  const handleLogout = async () => {
    try {
      // ✅ Use full backend URL
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      navigate('/');
      toast.success(t('logout_success') || 'Logged out successfully');
    } catch (error) {
      console.error('Logout failed', error);
      toast.error(t('logout_failed') || 'Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-pink-100 to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-2xl rounded-3xl border border-blue-200 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-6 relative">
          <label htmlFor="avatar-upload" className="cursor-pointer group relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="User Avatar"
                className="w-16 h-16 rounded-full shadow-md border-2 border-pink-300 object-cover"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-pink-400 text-white font-bold text-xl shadow-md">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow group-hover:scale-110 transition">
              <Upload size={16} className="text-blue-600" />
            </div>
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <div>
            <h1 className="text-3xl font-extrabold text-purple-700 drop-shadow">{t('profile')}</h1>
            <p className="text-gray-600">{user?.name || t('guest')}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-700 font-medium flex items-center gap-2">
            <Languages size={18} className="text-blue-500" />
            {t('language')}:
          </label>
          <select
            value={selectedLang}
            onChange={handleLanguageChange}
            className="mt-2 p-2 w-full border border-blue-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-sm text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-5 py-4 rounded-xl mb-6 shadow-lg">
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <Flame className="animate-pulse" />
            <span>
              <strong>{t('streak')}:</strong> {user?.streak || 0}
            </span>
          </div>
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <Star className="text-yellow-300" />
            <span>
              <strong>{t('points')}:</strong> {user?.points || 0}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">{t('tasks')}</h2>
          {user?.tasks?.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2">
              {user.tasks.map((task, index) => (
                <li
                  key={task.id}
                  className={`p-4 rounded-xl shadow-md transition-transform transform hover:scale-[1.02] border-l-8 relative
                    ${
                      index % 4 === 0
                        ? 'border-pink-500 bg-pink-50'
                        : index % 4 === 1
                        ? 'border-blue-500 bg-blue-50'
                        : index % 4 === 2
                        ? 'border-green-500 bg-green-50'
                        : 'border-purple-500 bg-purple-50'
                    }`}
                >
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                    title={t('delete')}
                  >
                    <Trash2 size={18} />
                  </button>
                  <h3 className="font-bold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {task.description || t('no_description')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">{t('no_tasks')}</p>
          )}
        </div>

        <div className="mt-10">
          <Leaderboard />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            <LogOut size={16} />
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
}
