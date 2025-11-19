import express from 'express';
import cors from 'cors';
const app = express();
import userRouter from './routes/userRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import subCategoryRouter from './routes/subCategoryRouter.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRouter);
app.use('/api/admin/categories',categoryRouter)
app.use('/api/admin/sub-categories',subCategoryRouter);








export default app;
