var db = require('../configDb');
var f = require("../fonctions.js");

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

module.exports.rechercherCitation = function(per_num, cit_date, moy, callback) {
    db.getConnection(function(err, connexion) {
	if(!err) {
	    var where = [], where_requete = "";
	    var having = [], having_requete = "";
	    var requete = "";
	    if (per_num != -1)
		where.push("p.per_num="+connexion.escape(per_num));

	    if(cit_date != -1)
		where.push("cit_date="+connexion.escape(f.getIsoDate(cit_date)));

	    if(moy != -1)
		having.push("moyenne > " + connexion.escape(parseInt(moy) - 1) + " AND moyenne < " + connexion.escape(parseInt(moy) + 1));

	    if (where.length > 0)
		where_requete = "WHERE " + where.join(" AND ");

	    if (having.length > 0)
		having_requete = "HAVING " + having.join(" AND ");
	    
	    requete = "SELECT p.per_num, c.cit_num, per_nom, per_prenom, cit_libelle, date_format(cit_date, '%d/%m/%Y') as cit_date, AVG(vot_valeur) as moyenne FROM citation c JOIN personne p ON c.per_num=p.per_num LEFT OUTER JOIN vote v ON v.cit_num=c.cit_num "+ where_requete +" GROUP BY c.cit_num, per_nom, per_prenom, cit_libelle, cit_date " + having_requete;

	    console.log(requete);
	    connexion.query(requete, callback);
	    connexion.release();
	}
    });
};
