import { pool } from '../helper/db.js';
import { Router } from "express";
import bcrypt from 'bcrypt';  
import jwt from 'jsonwebtoken';  

const router = Router();


router.post('/register', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    pool.query(
      'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
      [req.body.email, hashedPassword],
      (error, result) => {
        if (error) {
          console.error('Database error:', error);
          if (error.code === '23505') {
            return res.status(409).json({
              message: 'Email already exists',
              id: result ? result.rows[0].id : null,
              email: result ? result.rows[0].email : null
            });
          }
          return next(error);
        }
        console.log('Database result:', result);
        return res.status(201).json({
          id: result.rows[0].id,
          email: result.rows[0].email
        });
      }
    );
  } catch (error) {
    console.error('Error in registration process:', error);
  }
});


router.post('/login', async (req, res, next) => {
  const invalid_message = 'Invalid credentials.';
  try {

    const result = await pool.query('SELECT * FROM account WHERE email = $1', [req.body.email]);

    if (result.rowCount === 0) {
      return next(new Error(invalid_message));  
    }

    const user = result.rows[0];


    const match = await bcrypt.compare(req.body.password, user.password); 

    if (!match) {
      return next(new Error(invalid_message));  
    }

    const token = jwt.sign({ user: req.body.email }, process.env.JWT_SECRET_KEY);

    return res.status(200).json({
      id: user.id,
      email: user.email,
      token: token
    });
  } catch (error) {
    return next(error);  
  }
});

export default router;
