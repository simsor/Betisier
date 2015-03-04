var db = require('../configDb');
var module_personne = require("personne");

module.exports.addSalarie = function(data, callback) {
    module_personne.addPersonne(data, function(err, result) {

      if(!err) {
        var per_num = result.insertId;
        db.getConnection(function(err, connexion) {}
          var req = "INSERT INTO salarie (per_num, sal_telprof, fon_num) VALUES(" + per_num + ", " +connexion.escape(data.sal_telprof) + ", "+ connexion.escape(data.fon_num) + ")"
      }
    });
  });
};
