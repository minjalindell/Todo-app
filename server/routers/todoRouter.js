import { pool } from '../helper/db.js';
import { Router } from "express";
import { emptyOrRows } from '../helper/utils.js';
import { auth } from '../helper/auth.js'

const router = Router();

router.get('/', (req, res, next) => {
  pool.query('SELECT * FROM task', (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(result.rows);
  });
});

router.post('/create', (req, res, next) => {
  pool.query(
    'INSERT INTO task (description) VALUES ($1) RETURNING *',
    [req.body.description],
    (error, result) => {
      if (error) {
        return next(error);
      }
      const newTask = result.rows[0];
      return res.status(200).json(newTask);
    }
  );
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error', err.stack);
  } else {
    console.log('Database connected at', res.rows[0].now);
  }
});

router.delete('/delete/:id', (req, res, next) => {
  const id = parseInt(req.params.id); 
  pool.query('DELETE FROM task WHERE id = $1 RETURNING *', [id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No task found with the given ID' });
    }
    return res.status(200).json({
      message: 'Task deleted successfully',
      deletedTask: result.rows[0],
    });
  });
});

export default router;
