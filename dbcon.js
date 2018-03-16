var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_wiensda',
  password        : '2179',
  database        : 'cs290_wiensda'
});

module.exports.pool = pool;