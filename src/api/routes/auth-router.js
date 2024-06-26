import express from 'express';
import { getMe, login } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middlewares.js';

const authRouter = express.Router();


authRouter.route('/')
  .post(login);

authRouter.route('/verify')
  .get(
    authenticateToken,
    getMe
  )


export default authRouter;
