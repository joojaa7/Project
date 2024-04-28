import { addUser, getUser, updateAvatarFilename} from '../models/user-model.js';
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

const getUserByNameParams = async (req, res) => {
  console.log(req.params)
  const user = await getUser(req.params.name)
  console.log('get user', user)
  if (user){
    return res.json(user)
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
    res.status(500);
    console.log('Post user error.')
    next(error)
  }
};

const updateAvatar = async (req, res, next) => {
  console.log('Update avatar req', req);
  const result = await updateAvatarFilename(req)
  if (!result) {
    res.sendStatus(418);
    return
  }
  //res.status(200).send({message: 'Success.'});
  res.json(result)
}




export { getUserByName, postUser, updateAvatar, getUserByNameParams }
