var model = require('../models/citation.js');
var model_salarie = require('../models/salarie');
var model_mot = require("../models/mot");

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

     model_salarie.getAllSalarie(function(err, result) {
       if (!err) {
         response.liste_salaries = result;

         response.render('ajouterCitation', response);
      }
      else
        console.log(err);
     });

  } ;

  // ////////////////////////////////////////////// V E R I F I E R    C I T A T I O N

  module.exports.VerifierCitation = function(request, response) {
    response.title = 'Ajouter des citations';
    model_mot.searchForbiddenWords(request.body.cit_libelle, function(err, result) {
      if (!err) {
        if (result.length > 0) {
          var nouveau = request.body.cit_libelle;
          for (var i=0; i < result.length; i++) {
            nouveau = nouveau.replace(RegExp(result[i].mot_interdit, "i"), "---");
          }

          response.interdit = true;
          response.mots_interdits = result;
          response.cit_libelle = nouveau;
        }

          response.render("ajouterCitation", response);
      }
      else {
        response.error = true;
        console.log(err);
      }
    });
  };

// ////////////////////////////////////////////// R E C H E R C H E R     C I T A T I O N

module.exports.RechercherCitation = function(request, response){
   response.title = 'Rechercher des citations';
   response.render('rechercherCitation', response);


  } ;
