import express from 'express';
import cors from 'cors';
const app = express();
import userRouter from './routes/userRouter.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRouter);









export default app;
