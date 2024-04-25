import express from 'express';
import cors from 'cors';
import { getMe, login } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middlewares.js';

const authRouter = express.Router();

authRouter.use(cors());

authRouter.route('/').get((req, res, next) => {
  console.log(req.headers)
  console.log('Get catch')
  const user = {
    username: 'test',
    password: 'test'
  };
  res.json(user);
  next();
} ).post(function(req, res, next){
  console.log(req.headers);
  next();
},login);

authRouter.route('/verify')
  .get(
    authenticateToken,
    getMe
  )


export default authRouter;
