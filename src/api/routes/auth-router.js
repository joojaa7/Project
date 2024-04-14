import express from 'express';
import { login } from '../controllers/auth-controller.js';

const authRouter = express.Router();

authRouter.route('/').get(function(req, res){
  console.log('authRouter')
}).post(login);


export default authRouter;
