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
	return res.redirect("/403");
}

function checkEtudiant(req, res, next) {
    if (req.session.etudiant)
	return next();
    else
	return res.redirect("/403");
}

function checkSalarie(req, res, next) {
    if (req.session.salarie)
	return next();
    else
	return res.redirect("/403");
}

function checkEtudiantOuSalarie(req, res, next) {
    if (req.session.etudiant || req.session.salarie)
	return next();
    else
	return res.redirect("/403");
}

function checkAdmin(req, res, next) {
    if (req.session.admin)
	return next();
    else
	return res.redirect("/403");
}

// Routes
module.exports = function(app){

// Main Routes
    app.get('/', HomeController.Index);

// citations
    app.get('/listerCitation', CitationController.ListerCitation);
    app.get('/ajouterCitation', checkEtudiant, CitationController.AjouterCitation);
    app.post('/ajouterCitation', checkEtudiant, CitationController.VerifierCitation);
    app.get('/rechercherCitation', checkConnecte, CitationController.FormulaireRechercherCitation);
    app.post('/rechercherCitation', checkConnecte, CitationController.RechercherCitation);
    app.get('/validerCitation', checkAdmin, CitationController.ValiderCitation);
    app.get('/validerCitationOK/:cit_num', checkAdmin, CitationController.ValiderCitationOK);
    app.get('/supprimerCitation/:cit_num/:page', checkAdmin, CitationController.SupprimerCitation);
    app.get('/rechercherCitation', CitationController.RechercherCitation);
    app.get('/noterCitation/:cit_num', checkEtudiant, CitationController.ModifierNote);
    app.post('/noterCitation/:cit_num', checkEtudiant, CitationController.NoteOK);
    app.get('/supprimerNoteCitation/:cit_num', checkEtudiant, CitationController.SupprimerNote);

 // villes
   app.get('/listerVille', VilleController.ListerVille);
    app.get('/ajouterVille', checkConnecte, VilleController.AjouterVille);
    app.post('/ajouterVille', checkConnecte, VilleController.AjouterVilleOk);
    app.get('/modifierVille/:vil_num', checkConnecte, VilleController.ModifierVille);
    app.post('/modifierVille/:vil_num', checkConnecte, VilleController.ModifierVilleOk);
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
   app.get('/supprimerPersonne/:per_num', checkAdmin, PersonneController.SupprimerPersonne);

    // tout le reste
    app.get("/403", HomeController.NotAllowed);
    app.post("/403", HomeController.NotAllowed);
    app.get('*', HomeController.NotFound);
    app.post('*', HomeController.NotFound);
};
