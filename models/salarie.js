var db = require('../configDb');
var module_personne = require("./personne");

module.exports.getAllSalarie = function(callback) {
  db.getConnection(function(err, connexion) {
    if (!err) {
      var req = "SELECT * FROM salarie s JOIN personne p ON p.per_num = s.per_num";
      connexion.query(req, callback);
      connexion.release();
    }
    else {
	callback("Impossible de récupérer la connexion");
    }
  });
};

module.exports.addSalarie = function(data, callback) {
    module_personne.addPersonne(data, function(err, result) {

      if(!err) {
        var per_num = result.insertId;
        db.getConnection(function(err, connexion) {
          if (!err) {
              var req = "INSERT INTO salarie (per_num, sal_telprof, fon_num) VALUES(" + per_num + ", " +connexion.escape(data.sal_telprof) + ", "+ connexion.escape(data.fon_num) + ")";
            connexion.query(req, callback);
            connexion.release();
          }
          else
           console.log("Impossible de se connecter");
        });
      }
      else {
        console.log("Impossible d'ajouter la personne : " + err);
        callback("Impossible d'ajouter la personne.", undefined);
      }
  });
};

module.exports.getSalarieByPerNum = function(per_num, callback) {
    db.getConnection(function(err, connexion) {
	if (!err) {
	    var req = "SELECT * FROM salarie WHERE per_num = " + connexion.escape(per_num);
	    connexion.query(req, callback);
	    connexion.release();
	}
    });
};
