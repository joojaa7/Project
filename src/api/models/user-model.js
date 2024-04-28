import promisePool from '../../utils/database.js';

const addUser = async (user, file) => {
  try {
  const sql = `INSERT INTO users_single (username, password, avatar)
               VALUES (?, ?, ?)`
  const avatar = file?.filename || null;
  const data = [user.username, user.password, avatar]
  const rows = await promisePool.execute(sql, data);
  if (rows[0].affectedRows === 0){
    return false
  }
  return {user_id: rows[0].insertId};
  } catch (e) {
    }
}

const getUser = async (user) => {
  const [rows] = await promisePool.execute('SELECT * FROM users_single WHERE username = ?', [user]);
  if (rows.length === 0){
    return false;
  }
  return rows[0]
}

const updateAvatarFilename = async (req) => {
  const sql = `UPDATE users_single SET avatar = ? WHERE username = ?`
  const data = [req.file.filename, req.body.username]
  const rows = await promisePool.execute(sql, data)
  if (rows[0].affectedRows === 0){
    return false
  }
  if (req.file){
    return {avatar: req.file.filename}
  }
}




export {addUser, getUser, updateAvatarFilename}
