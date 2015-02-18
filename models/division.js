var db = require('../configDb');

module.exports.getAllDivision = function (callback) {
  db.getConnection(function(err, connexion){
     req= "SELECT * FROM division";
     connexion.query(req, callback);
     connexion.release();
  });
};
