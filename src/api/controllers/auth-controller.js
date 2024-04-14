import { getUser } from "../models/user-model.js";
import 'dotenv/config';

const login = async (req, res) => {
  console.log('post username', req.body.username)
  const user = await getUser(req.body.username);
  if (!user){
    res.sendStatus(401);
    return
  }
  res.sendStatus(200);
  return
}

export { login };
