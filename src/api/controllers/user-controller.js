import { addUser, getUser} from '../models/user-model.js';

const getUserByName = async (req, res) => {
  console.log(req.params)
  const user = await getUser(req.params.name)
  if (user){
    res.json(user)
  } else {
    res.sendStatus(404);
  }
}


const postUser = async (req, res) => {

}

export { getUserByName, postUser }
