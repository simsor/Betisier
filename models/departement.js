var db = require('../configDb');


module.exports.getAllDepartement = function (callback) {
  db.getConnection(function(err, connexion){
     req= "SELECT * from departement";
     connexion.query(req, callback);
     connexion.release();
   });
};
