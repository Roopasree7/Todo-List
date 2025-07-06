import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/tasks/leaderboard', { withCredentials: true })
      .then(res => {
        if (Array.isArray(res.data)) setLeaders(res.data);
        else throw new Error("Invalid format");
      })
      .catch(err => {
        setError("Failed to fetch leaderboard.");
      });
  }, []);

  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <h2 className="text-xl font-bold mb-2">🏆 Leaderboard</h2>
      {error ? <p className="text-red-200">{error}</p> : (
        <ul>
          {leaders.map((u, i) => (
            <li key={u.name} className="mb-1 flex justify-between items-center">
              <span>
                <strong>{i + 1}. {u.name}</strong> — {u.points} pts
              </span>
              <span className="ml-4 text-yellow-200 font-semibold">
                🔥 Streak: {u.streak}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;