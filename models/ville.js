/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/
var db = require('../configDb');

/*
* Récupérer l'intégralité des Villes
* @return Un tableau de Ville avec le N° et le nom
*/
module.exports.getListeVille = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
            connexion.query('SELECT vil_num, vil_nom from ville', callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.addVille = function (vil_nom, callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
				if(!err){
						// s'il n'y a pas d'erreur de connexion
						// execution de la requête SQL
						connexion.query('INSERT INTO ville (vil_nom) VALUES (' + connexion.escape(vil_nom) + ')', callback);

						// la connexion retourne dans le pool
						connexion.release();
				}
			});
};

module.exports.deleteVille = function (vil_num, callback) {
	// connexion à la BD
	db.getConnection (function(err, connexion) {
		if (! err) {

			// on récupère tous les votes par personne
			var requete = "DELETE from ville WHERE vil_num="+connexion.escape(vil_num);
			// envoi de la requete a la BD
			connexion.query(requete, callback);

			// la connexion est renvoyée dans le pool de connexions
			connexion.release();
		}
	});
};
