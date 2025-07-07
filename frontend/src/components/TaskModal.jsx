import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function TaskModal({ closeModal, refreshTasks, onError }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      onError('Title is required');
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/tasks`,
        { title, description, dueDate },
        { withCredentials: true }
      );
      refreshTasks();
      closeModal();
    } catch (err) {
      console.error(err);
      onError('Error creating task');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Create New Task</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-md h-24 resize-none focus:ring-2 focus:ring-purple-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="date"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
