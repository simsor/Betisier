var model = require('../models/personne.js');

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
			return
		}
		if (request.body.resultat == reponseConnexion) {
			response.captchaOk = true;
			if (result.length == 0) {
				response.connexionOk=false;
			}
			else {
				response.connexionOk=true;
				session.login = request.body.login;
				session.connected = true;
			}
		}
		else {
			response.captchaOk = false;
		}

		response.login = login;
		response.render('connection', response);
	});
};

 // ////////////////////////////////////////////// D E C O N N E C T   U T I L I S A T E U R
module.exports.Deconnect = function(request, response){

	 response.redirect('/connect');
};
