import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


export default function TaskCard({ task, refreshTasks }) {
  const [loading, setLoading] = useState(false);

  const markDone = async () => {
    setLoading(true);
    try {
      await axios.put(
        `/api/tasks/${task.id}`,
        { status: 'done' },
        { withCredentials: true }
      );
      refreshTasks();
    } catch (err) {
      alert('Failed to mark as done');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/tasks/${task.id}`, { withCredentials: true });
      refreshTasks();
    } catch (err) {
      alert('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h3 className="font-bold text-lg">{task.title}</h3>
      <p>{task.description}</p>
      <p className="text-sm text-gray-600">
        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
      </p>
      <p className="text-sm mt-1">
        Status: <span className={task.status === 'done' ? 'text-green-600' : 'text-yellow-600'}>
          {task.status}
        </span>
      </p>
      <div className="mt-2 flex space-x-2">
        {task.status !== 'done' && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
            onClick={markDone}
            disabled={loading}
          >
            Mark Done
          </button>
        )}
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
          onClick={deleteTask}
          disabled={loading}
        >
          Delete
        </button>
      </div>
    </div>
  );
}