/*const Pool = require('pg').Pool
const pool = new Pool({
  user: 'my_user',
  host: 'localhost',
  database: 'my_database',
  password: 'root',
  port: 5432,
});
*/
const getMerchants = () => {
//  return new Promise(function(resolve, reject) {
	  sayHello()
	  /*
    pool.query('SELECT * FROM contact ORDER BY name ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })*/
  }) 
}

  function sayHello() {
    alert('Hello   world!');
  }
 
module.exports = {
  getMerchants, sayHello
}
