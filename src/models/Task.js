const pool = require('../config/db');

class Task {
  static async create({ userId, description }) {
    const query = `
      INSERT INTO tasks (user_id, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [userId, description];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAllByUser(userId) {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async findByIdAndUser(taskId, userId) {
    const query = 'SELECT * FROM tasks WHERE id = $1 AND user_id = $2';
    const { rows } = await pool.query(query, [taskId, userId]);
    return rows[0];
  }

  static async update({ taskId, userId, description, isCompleted }) {
    const query = `
      UPDATE tasks
      SET description = $1, is_completed = $2, updated_at = NOW()
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `;
    const values = [description, isCompleted, taskId, userId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(taskId, userId) {
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *';
    const { rows } = await pool.query(query, [taskId, userId]);
    return rows[0];
  }
}

module.exports = Task;