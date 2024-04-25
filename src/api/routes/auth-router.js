import express from 'express';
import cors from 'cors';
import { getMe, login } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middlewares.js';

const authRouter = express.Router();

authRouter.use(cors());

authRouter.route('/').post(function(req, res, next){
  console.log('Post catch')
  next();
},login);

authRouter.route('/verify')
  .get(
    authenticateToken,
    getMe
  )


export default authRouter;
