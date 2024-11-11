import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt'; 
import { pool } from './db.js';
import pkg from 'jsonwebtoken';
const { sign } = pkg;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const initializeTestDb = async () => {
  try {
    const sqlPath = path.resolve('todo.sql');
    console.log(`Using SQL file at: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await pool.query(sql);
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

const insertTestUser = async (email, password) => {
    const existingUser = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
    if (existingUser.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    }
  };

const getToken = (email) => {
  return sign({ user: email }, process.env.JWT_SECRET_KEY);
};

export { initializeTestDb, insertTestUser, getToken };
