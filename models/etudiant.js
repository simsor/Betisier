var db = require('../configDb');
var module_personne = require("./personne");

module.exports.addEtudiant = function(data, callback) {
    module_personne.addPersonne(data, function(err, result) {

      if(!err) {
        var per_num = result.insertId;
        db.getConnection(function(err, connexion) {
           if (!err) {
  	          var req = "INSERT INTO etudiant (per_num, dep_num, div_num) VALUES(" + per_num + ", " +connexion.escape(data.dep_num) + ", "+ connexion.escape(data.div_num) + ")";
              connexion.query(req, callback);
              connexion.release();
           }
           else
            console.log("Impossible de se connecter");
        });
      }
      else {
        console.log("Impossible d'ajouter la personne : " + err);
        callback("Impossible d'ajouter la personne", undefined);
      }
  });
};
