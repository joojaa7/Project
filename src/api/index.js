import express from 'express';
import userRouter from './routes/user-router.js';
import authRouter from './routes/auth-router.js';

const router = express.Router();

router.use('/', userRouter);
router.use('/login', authRouter)

export default router;

