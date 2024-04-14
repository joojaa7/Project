import promisePool from '../../utils/database.js';

const addUser = async (user) => {
  console.log('Add user', user)
  const sql = `INSERT INTO wsk_users (password, name, username, email)
               VALUES (?, ?, ?, ?)`
  const data = [user.password, user.username, 'Username', 'generic@email.com']
  const rows = await promisePool.execute(sql, data);
  if (rows[0].affectedRows === 0){
    return false
  }
  console.log( 'Success.')
  return
}

const getUser = async (user) => {
  const [rows] = await promisePool.execute('SELECT * FROM wsk_users WHERE name = ?', [user]);
  if (rows.length === 0){
    return false;
  }
  return rows[0]
}

export {addUser, getUser}
