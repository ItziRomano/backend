const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, firstName, lastName }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, created_at
    `;
    const values = [email, hashedPassword, firstName, lastName];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, first_name, last_name FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = User;