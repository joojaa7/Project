import express from 'express';
import { getUserByName, postUser } from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.route('/login/:name').get(getUserByName).post(postUser);

export default userRouter;
