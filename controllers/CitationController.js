var model = require('../models/citation.js');

// ////////////////////////////////////////////// L I S T E R     C I T A T I O N

module.exports.ListerCitation = 	function(request, response){
   response.title = 'Liste des citations';
   model.getListeCitations(function(err, result){
     if (err) {
       console.log(err);
       return;
     }
     response.listeCitation = result;
     response.nbCitations = result.length;
     response.render('listerCitation', response);
   });
} ;

// ////////////////////////////////////////////// A J O U T E R     C I T A T I O N

module.exports.AjouterCitation = 	function(request, response){
	   response.title = 'Ajouter des citations';
   response.render('ajouterCitation', response);

  } ;


// ////////////////////////////////////////////// R E C H E R C H E R     C I T A T I O N

module.exports.RechercherCitation = function(request, response){
   response.title = 'Rechercher des citations';
   response.render('rechercherCitation', response);


  } ;
