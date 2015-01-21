var db = require('../configDb');

		/**
		 * Récupérer l'intégralité des Villes
		 * @return Un tableau de Ville avec le N° et le nom
		 */
module.exports.getListeVille = function (callback) {	
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connection
        	  // execution de la requête SQL
            connexion.query('SELECT vil_num, vil_nom from ville', callback);
            // la concection retourne dans le pool
            connexion.release();
         }
      });   
};
