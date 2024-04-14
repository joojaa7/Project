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
    const request = await addUser(req.body)
    if (!request) {
      res.sendStatus(400)
    }
    console.log('Post user was a success.')
}

export { getUserByName, postUser }
