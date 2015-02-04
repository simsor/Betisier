// appel du module pour le cryptage du mot de passe
var crypto=require('crypto');
var db = require('../configDb');


/*
* Vérifie le nom utilisateur et son mot de passe
*
* @param     data.login : le login de l'utilisateur
* @param     data.pass : le mot de passe
* @return l'identifiant de la personne si le mot de passe et le login sont bons
*     Rien sinon
*
*/
module.exports.getLoginOk = function (data, callback) {
	db.getConnection(function(err, connexion){
 	if(!err){
   	var sha256 = crypto.createHash("sha256"); // cryptage en sha256
   	sha256.update(data.pass, "utf8");
   	var resu = sha256.digest("base64");
	//console.log ('Mot de passe en clair : ' + data.pass);
	//console.log ('Mot de passe crypté : ' + resu);
 		req= "SELECT per_num from personne where per_login =" + connexion.escape(data.login) + " and per_pwd = " +connexion.escape(resu);
   //console.log(req);
   	connexion.query(req, callback);
   	connexion.release();
   }
   	});
};

/*
* Récupérer l'intégralité des Personnes
* @return Un tableau de Personnes avec le N°, le nom et le prenom
*/
module.exports.getListePersonne = function(callback) {
	// connexion a la base de donnée
	db.getConnection(function(err, connexion) {
		if (! err) {
			var requete = 'SELECT per_num, per_nom, per_prenom FROM personne'

			// envoi de la requete à la BD
			connexion.query(requete, callback);

			// retour de la connexion dans le pool
			connexion.release();
		}
	});
}
