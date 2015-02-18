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
};

/*
* Récupérer le détail d'une personne
* @return Un tableau d'une Personne avec le prénom, le mail, le téléphone, le département et la ville
*/
module.exports.getDetailPersonne = function(num, callback) {
	// connexion a la base de donnée
	db.getConnection(function(err, connexion) {
		if (! err) {
			var requete = 'SELECT per_nom, per_prenom, per_mail, per_tel, dep_nom, vil_nom, sal_telprof, fon_libelle FROM personne p LEFT OUTER JOIN etudiant e ON e.per_num=p.per_num LEFT OUTER JOIN departement d ON e.dep_num=d.dep_num LEFT OUTER JOIN ville v ON v.vil_num=d.vil_num LEFT OUTER JOIN salarie s ON s.per_num=p.per_num LEFT OUTER JOIN fonction f ON f.fon_num=s.fon_num WHERE p.per_num='+connexion.escape(num);

			// envoi de la requete à la BD
			connexion.query(requete, callback);

			// retour de la connexion dans le pool
			connexion.release();
		}
	});
}

module.exports.addPersonne = function(data, callback) {
	// connexion a la base de donnée
	db.getConnection(function(err, connexion) {
		if (! err) {
			var requete = 'INSERT INTO personne (per_nom, per_prenom, per_tel, per_mail, per_login, per_pwd) VALUES (' + connexion.escape(data.per_nom) +', '+ connexion.escape(data.per_prenom) +', ' + connexion.escape(data.per_tel) +', ' + connexion.escape(data.per_mail) +', ' + connexion.escape(data.per_login) +', '+ connexion.escape(data.per_pwd)+')';

			// envoi de la requete à la BD
			connexion.query(requete, callback);

			// retour de la connexion dans le pool
			connexion.release();
		}
	});
}
