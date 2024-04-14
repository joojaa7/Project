import promisePool from '../../utils/database.js';

const addUser = (user) => {

}

const getUser = async (user) => {
  console.log(user);
  const [rows] = await promisePool.execute('SELECT * FROM user_info WHERE name = ?', [user]);
  console.log('sql response', rows);
  if (rows.length === 0){
    return false;
  }
  return rows[0]
}

export {addUser, getUser}
