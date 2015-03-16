var HomeController = require('./../controllers/HomeController');
var ConnectController = require('./../controllers/ConnectController');
var PersonneController = require('./../controllers/PersonneController');
var CitationController = require('./../controllers/CitationController');
var VilleController = require('./../controllers/VilleController');

// Fonctions pour checker le niveau des visiteurs

function checkConnecte(req, res, next) {
    if (req.session.connected)
	return next();
    else
	return res.redirect("/");
}

function checkEtudiant(req, res, next) {
    if (req.session.etudiant)
	return next();
    else
	return res.redirect("/");
}

function checkSalarie(req, res, next) {
    if (req.session.salarie)
	return next();
    else
	return res.redirect("/");
}

function checkEtudiantOuSalarie(req, res, next) {
    if (req.session.etudiant || req.session.salarie)
	return next();
    else
	return res.redirect("/");
}

function checkAdmin(req, res, next) {
    if (req.session.admin)
	return next();
    else
	return res.redirect("/");
}

// Routes
module.exports = function(app){

// Main Routes
    app.get('/', HomeController.Index);

// citations
    app.get('/listerCitation', CitationController.ListerCitation);
    app.get('/ajouterCitation', checkEtudiant, CitationController.AjouterCitation);
    app.post('/ajouterCitation', checkEtudiant, CitationController.VerifierCitation);
    app.get('/rechercherCitation', checkConnecte, CitationController.RechercherCitation);
    app.get('/validerCitation', checkAdmin, CitationController.ValiderCitation);
    app.get('/validerCitationOK/:cit_num', checkAdmin, CitationController.ValiderCitationOK);
    app.get('/supprimerCitation/:cit_num', checkAdmin, CitationController.SupprimerCitation);
    app.get('/rechercherCitation', CitationController.RechercherCitation);
    app.get('/noterCitation/:cit_num', CitationController.ModifierNote);
    app.post('/noterCitation/:cit_num', CitationController.NoteOK);
    app.get('/supprimerNoteCitation/:cit_num', CitationController.SupprimerNote);

 // villes
   app.get('/listerVille', VilleController.ListerVille);
    app.get('/ajouterVille', checkConnecte, VilleController.AjouterVille);
    app.post('/ajouterVille', checkConnecte, VilleController.AjouterVilleOk);
    app.get('/modifierVille', checkConnecte, VilleController.ModifierVille);
    app.get('/supprimerVille/:vil_num', checkAdmin, VilleController.SupprimerVille);

// connection
   app.get('/connect', ConnectController.Connect);
   app.post('/connect', ConnectController.ConnectOk);
    app.get('/deconnect', checkConnecte, ConnectController.Deconnect);


 //personne
   app.get('/listerPersonne', PersonneController.ListerPersonne);
    app.get('/ajouterPersonne', checkConnecte, PersonneController.AjouterPersonne);
    app.post('/ajouterPersonne', checkConnecte, PersonneController.AjouterPersonneOk);
   app.get('/detailPersonne/:num', PersonneController.DetailPersonne);

// tout le reste
  app.get('*', HomeController.Index);
  app.post('*', HomeController.Index);

};
