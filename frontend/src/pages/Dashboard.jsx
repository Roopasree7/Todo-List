import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = () => {
    axios
      .get('/api/tasks', { withCredentials: true })
      .then(res => {
        if (Array.isArray(res.data)) {
          setTasks(res.data);
          setError(null);
        } else {
          throw new Error("Invalid tasks format");
        }
      })
      .catch(err => {
        console.error("Fetch tasks error:", err);
        setError(t('fetch_error') || "Failed to load tasks.");
      });
  };

  useEffect(fetchTasks, []);

  const handleModalError = (msg) => setError(msg);

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">{t('Todo List')}</h1>
        <button
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 duration-150"
          onClick={() => setModalOpen(true)}
        >
          + {t('create_task')}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-700 text-white p-2 rounded my-4">
          {error}
        </div>
      )}

      {/* Task List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} refreshTasks={fetchTasks} />
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          closeModal={() => setModalOpen(false)}
          refreshTasks={fetchTasks}
          onError={handleModalError}
        />
      )}
    </div>
  );
}
