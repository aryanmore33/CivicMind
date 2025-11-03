const pool = require('../config/pool');


const createUser = async (name, email, passwordHash, role, phone_number, city) => {
  try {
    const query = `
      INSERT INTO users (name, email, password_hash, role, phone_number, city) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING user_id, name, email, role, phone_number, city, created_at;
    `;
    const result = await pool.query(query, [
      name,
      email,
      passwordHash,
      role || 'citizen',
      phone_number || null,
      city || null
    ]);
    return result.rows[0];
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

const findUserByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1::text;';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

