var db = require('../configDb');

module.exports.getListeVoteByPerNum = function (per_num, callback) {
  // connexion à la BD
  db.getConnection (function(err, connexion) {
    if (! err) {

      // on récupère tous les votes par personne
      var requete = "SELECT v.cit_num, v.per_num, v.vot_valeur from vote v join etudiant e on v.per_num=e.per_num WHERE e.per_num="+connexion.escape(per_num);
      // envoi de la requete a la BD
      connexion.query(requete, callback);

      // la connexion est renvoyée dans le pool de connexions
      connexion.release();
    }
  });
};

module.exports.deleteVote = function (cit_num, per_num, callback) {
  // connexion à la BD
  db.getConnection (function(err, connexion) {
    if (! err) {

      // on récupère tous les votes par personne
      var requete = "DELETE from vote WHERE cit_num="+connexion.escape(cit_num)+" and per_num="+connexion.escape(per_num);
      // envoi de la requete a la BD
      connexion.query(requete, callback);

      // la connexion est renvoyée dans le pool de connexions
      connexion.release();
    }
  });
};

module.exports.updateVote = function (cit_num, per_num, vot_valeur, callback) {
  // connexion à la BD
  db.getConnection (function(err, connexion) {
    if (! err) {

      // on récupère tous les votes par personne
      var requete = "UPDATE vote SET vot_valeur="+connexion.escape(vot_valeur)+" WHERE cit_num="+connexion.escape(cit_num)+" and per_num="+connexion.escape(per_num);
      // envoi de la requete a la BD
      connexion.query(requete, callback);

      // la connexion est renvoyée dans le pool de connexions
      connexion.release();
    }
  });
};
