var db = require('../configDb');

module.exports.getListeCitations = function (callback) {
  // connexion à la BD
  db.getConnection (function(err, connexion) {
    if (! err) {

      // on récupère toutes les citations par prof, par date et avec leur moyenne
      var requete = "SELECT c.cit_num, per_nom, per_prenom, cit_libelle, date_format(cit_date, '%d/%m/%Y') as cit_date, AVG(vot_valeur) as moyenne FROM citation c JOIN personne p ON c.per_num=p.per_num LEFT OUTER JOIN vote v ON v.cit_num=c.cit_num GROUP BY c.cit_num, per_nom, per_prenom, cit_libelle, cit_date";

      // envoi de la requete a la BD
      connexion.query(requete, callback);

      // la connexion est renvoyée dans le pool de connexions
      connexion.release();
    }
  });
};

module.exports.getListeCitationsValidees = function(callback) {
    db.getConnection(function(err, connexion) {
	if (!err) {
	    var requete = "SELECT c.cit_num, per_nom, per_prenom, cit_libelle, date_format(cit_date, '%d/%m/%Y') as cit_date, AVG(vot_valeur) as moyenne FROM citation c JOIN personne p ON c.per_num=p.per_num LEFT OUTER JOIN vote v ON v.cit_num=c.cit_num WHERE cit_valide=1 GROUP BY c.cit_num, per_nom, per_prenom, cit_libelle, cit_date";

	    connexion.query(requete, callback);

	    connexion.release();
	}
    });
};
