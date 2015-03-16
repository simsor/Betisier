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

module.exports.getListeCitationsNonValidees = function(callback) {
    db.getConnection(function(err, connexion) {
	if (!err) {
	    var requete = "SELECT c.cit_num, p.per_nom AS ens_nom, p.per_prenom AS ens_prenom, p.per_num AS ens_num, etu.per_nom AS etu_nom, etu.per_prenom AS etu_prenom, etu.per_num AS etu_num, cit_libelle, date_format(cit_date, '%d/%m/%Y') as cit_date FROM citation c JOIN personne p ON c.per_num=p.per_num JOIN personne etu ON etu.per_num = c.per_num_etu WHERE cit_valide=0 AND cit_date_valide IS NULL";

	    connexion.query(requete, callback);

	    connexion.release();
	}
    });
};

module.exports.addCitation = function(data, callback) {
    db.getConnection(function(err, connexion) {
	if (!err) {
	    connexion.query("INSERT INTO citation SET ?", data, callback);
	    connexion.release();
	}
    });
};

module.exports.validerCitation = function(cit_num, per_num, callback) {
    db.getConnection(function(err, connexion) {
	if (!err) {
	    connexion.query("UPDATE citation SET per_num_valide=" + connexion.escape(per_num) + ", cit_date_valide=NOW(), cit_valide=1 WHERE cit_num=" + connexion.escape(cit_num), callback);
	    
	    connexion.release();
	}
    });
};

module.exports.supprimerCitation = function(cit_num, callback) {
    db.getConnection(function(err, connexion) {
	if (!err) {
	    connexion.query("DELETE FROM citation WHERE cit_num=" + connexion.escape(cit_num), callback);
	    
	    connexion.release();
	}
    });
};
