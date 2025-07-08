const Task = require('../models/Task');
const User = require('../models/User');

exports.completeTask = async (req, res) => {
  try {
    // 1. Find the task by ID
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // 2. Mark task as completed
    task.completed = true; // ✅ Boolean field fix
    await task.save();

    // 3. Update user points and streak
    const user = await User.findById(req.user._id);
    const today = new Date().toDateString();
    const last = user.lastCompletedDate ? new Date(user.lastCompletedDate).toDateString() : null;

    if (last !== today) {
      if (last === new Date(Date.now() - 86400000).toDateString()) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }

      user.lastCompletedDate = new Date();
      user.points += 10;
      await user.save();

      // 4. Emit leaderboard update event via Socket.IO
      const io = req.app.get('io');
      io.emit('leaderboardUpdate');
    }

    // 5. Respond with success
    res.json({ message: 'Task completed', task });
  } catch (err) {
    console.error('Error completing task:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
