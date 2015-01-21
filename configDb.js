var mysql = require('mysql');
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'bd',
  password : 'bede',
  database : 'betisier'
});

module.exports.getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};
	