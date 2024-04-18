import { addUser, getUser} from '../models/user-model.js';
import bcrypt from 'bcrypt';

const getUserByName = async (name) => {
  console.log(name)
  const user = await getUser(name)
  console.log('get user', user)
  if (user){
    return user
  } else {
    return
  }
}


const postUser = async (req, res, next) => {
  req.body.password = bcrypt.hashSync(req.body.password, 5);
  try {
    const result = await addUser(req.body, req.file);
    if (!result) {
      const error = new Error("Invalid or missing fields")
      error.status = 400
      next(error);
      return;
    }
    res.status(200).send({message: 'Success.'});
    next();
  } catch (error) {
    console.log('Post user error.')
    next(error)
  }
};




export { getUserByName, postUser }
