import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import todoRouter from './routers/todoRouter.js';
import userRouter from './routers/userRouter.js';
import { register, login } from './helper/auth.js'; 

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/login', login);  

app.post('/register', register);  

app.use('/protected', (req, res) => {
  res.status(200).json({ message: "You are authorized" });
});

app.use('/', todoRouter);
app.use('/user', userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error('Error details:', err);  
  res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
