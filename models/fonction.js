var db = require('../configDb');


module.exports.getAllFonction = function (callback) {
  db.getConnection(function(err, connexion){
     req= "SELECT * from fonction";
     connexion.query(req, callback);
     connexion.release();
   });
};
