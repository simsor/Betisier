var model = require('../models/personne.js');
var model_etudiant = require("../models/etudiant.js");
var model_salarie = require("../models/salarie.js");
var async = require("async");

function getRandomInt(min, max) {
	return Math.floor(Math.random()*(max-min))+min;
}

  // ////////////////////////////////////////////// C O N N E C T   U T I L I S A T E U R
module.exports.Connect = function(request, response){
		var session = request.session;

		response.title = "Connexion";

		response.nombre1=getRandomInt(1,10);
		response.nombre2=getRandomInt(1,10);
		session.reponseTestLogin = response.nombre1 + response.nombre2;

    response.render('connect', response);
};

// ////////////////////////////////////////////// C O N N E C T   O K
module.exports.ConnectOk = function(request, response){
	var session = request.session;
	var reponseConnexion = session.reponseTestLogin;
	var login = request.body.login;

	response.title = "Connexion";

	model.getLoginOk({"login" : request.body.login, "pass" : request.body.pass} , function (err, result) {
		if (err) {
			console.log(err);
		        return;
		}
		if (request.body.resultat == reponseConnexion) {
			response.captchaOk = true;
			if (result.length == 0) {
			    response.connexionOk=false;
			    console.log("Erreur de connexion");
			    response.render('connection', response);
			}
		    else {
			var per_num = result[0].per_num;
			session.admin = (result[0].per_admin == 1);
			console.log(session.admin);
			async.parallel([
			    function(callback) {
				model_etudiant.getEtudiantByPerNum(per_num, function(err, result) {
				    if (result.length > 0) // Alors c'est un étudiant
					callback(null, true);
				    else
					callback(err);
				});
			    },
			    function(callback) {
				model_salarie.getSalarieByPerNum(per_num, function(err, result) {
				    if (result.length > 0) // C'est un salarié
					callback(null, true);
				    else
					callback(err);
				});
			    }], function(err, result) {
				if (err) {
				    console.log(err);
				    return;
				}
				response.connexionOk=true;
				session.login = request.body.login;
				session.per_num = per_num;
				session.etudiant = result[0];
				session.salarie = result[1];
				session.connected = true;
				response.render('connection', response);
			    });
			}
		}
		else {
		    response.captchaOk = false;
		    response.render('connection', response);
		}

		response.login = login;
		// response.render('connection', response);
	});
};

 // ////////////////////////////////////////////// D E C O N N E C T   U T I L I S A T E U R
module.exports.Deconnect = function(request, response){
    request.session.destroy();
    response.render('disconnect');
};
