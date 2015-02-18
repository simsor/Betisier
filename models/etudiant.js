var db = require('../configDb');
var module_personne = require("personne");

module.exports.addEtudiant = function(data, callback) {
  module_personne.addPersonne(data, function(err, result) {

    var per_num = result.insertId;
    db.getConnection(function(err, connexion) {}
      var req = "INSERT INTO etudiant (per_num, dep_num, div_num) VALUES(" + connexion.escape("prout") + ")"
    });
  });
};
