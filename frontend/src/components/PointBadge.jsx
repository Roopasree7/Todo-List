import React from 'react';

const PointsBadge = ({ streak, points }) => (
  <div className="points-badge">
    🔥 Streak: {streak} days | ⭐ Points: {points}
  </div>
);

export default PointsBadge;
