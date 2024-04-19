import promisePool from '../../utils/database.js';

const addUser = async (user, file) => {
  console.log('Add user', user)
  const sql = `INSERT INTO users_single (username, password, avatar)
               VALUES (?, ?, ?)`
  const avatar = file?.filename || null;
  const data = [user.username, user.password, avatar]
  const rows = await promisePool.execute(sql, data);
  if (rows[0].affectedRows === 0){
    return false
  }
  console.log( 'Success.')
  return {user_id: rows[0].insertId};
}

const getUser = async (user) => {
  const [rows] = await promisePool.execute('SELECT * FROM users_single WHERE username = ?', [user]);
  if (rows.length === 0){
    console.log(rows, 'Return false')
    return false;
  }
  return rows[0]
}

const updateAvatarFilename = async (req) => {
  console.log('Put user', req)
  const sql = `UPDATE users_single SET avatar = ? WHERE username = ?`
  const data = [req.body.avatar, req.body.username]
  const rows = await promisePool.execute(sql, data)
  if (rows[0].affectedRows === 0){
    return false
  }
  console.log('PUT success')
  if (req.file){
    return {avatar: req.file.filename}
  }
}




export {addUser, getUser, updateAvatarFilename}
