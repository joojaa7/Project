import promisePool from '../../utils/database.js';

const addUser = async (user) => {
  console.log('Add user', user)
  const sql = `INSERT INTO user_info (pw, name)
               VALUES (?, ?)`
  const data = [user.username, user.password]
  const rows = await promisePool.execute(sql, data);
  if (rows[0].affectedRows === 0){
    return false
  }
  console.log( 'Success.')
  return
}

const getUser = async (user) => {
  const [rows] = await promisePool.execute('SELECT * FROM user_info WHERE name = ?', [user]);
  if (rows.length === 0){
    return false;
  }
  return rows[0]
}

export {addUser, getUser}
