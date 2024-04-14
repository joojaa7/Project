import express from 'express';
import { getUserByName, postUser } from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.route('/user/:name').get(getUserByName);
userRouter.route('/user').post(postUser);

export default userRouter;
