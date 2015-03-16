var model = require('../models/citation.js');
var model_salarie = require('../models/salarie');
var model_mot = require("../models/mot");
var async = require("async");
var fonctions = require("../fonctions");
var model_vote = require('../models/vote.js');

// ////////////////////////////////////////////// L I S T E R     C I T A T I O N

module.exports.ListerCitation = 	function(request, response){
   response.title = 'Liste des citations';
   model.getListeCitationsValidees(function(err, result){
     if (err) {
       console.log(err);
       return;
     }
     var listeCitations = result;
     model_vote.getListeVoteByPerNum(request.session.per_num, function(err, result){
       if (err){
          console.log(err);
       }
       else {
           var listeVotes = result;
          for (var i = 0; i<listeCitations.length; i++) {
            for (var j = 0; j<listeVotes.length; j++) {
                if (listeCitations[i].cit_num == listeVotes[j].cit_num) {
                  listeCitations[i].dejaVote = true;
                }
          }
        }
      }
     });
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
      async.parallel([
	  function(callback) {
	      model_mot.searchForbiddenWords(request.body.cit_libelle, function(err, result) {
		  if (!err) {
		      if (result.length > 0) {
			  var nouveau = request.body.cit_libelle;
			  for (var i=0; i < result.length; i++) {
			      var regex = result[i].mot_interdit;
			      regex = regex.replace("é", "[ée]");
			      regex = regex.replace("è", "[èe]");
			      regex = regex.replace("à", "[àa]");
			      regex = regex.replace("î", "[îi]");
			      nouveau = nouveau.replace(RegExp(regex, "i"), "---");
			  }

			  var retour = {
			      interdit : true,
			      mots_interdits: result,
			      cit_libelle: nouveau
			  };
			  callback(null, retour);
		      }
		      else
			  callback(null, { interdit: false });
		  }
		  else
		      callback(err);
	      });
	  },
			  function(callback) {
			       model_salarie.getAllSalarie(function(err, result) {
				   if (!err) {
				       callback(null, result);
				   }
				   else
				       callback(err);
			       });
			  }], function(err, result) {
			      if (err) {
				  console.log(err);
				  return;
			      }

			      if (!result[0].interdit) {
				  // Si il n'y a pas de mots interdits
				  // On ajoute la citation
				  var nouvDate = fonctions.getIsoDate(request.body.cit_date);
				  if (!nouvDate) {
				      var date = new Date();
				      nouvDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
				  }

				  console.log(nouvDate);

				  model.addCitation({
				      per_num: request.body.per_num,
				      per_num_etu: request.session.per_num,
				      cit_libelle: request.body.cit_libelle,
				      cit_date: nouvDate
				  }, function(err, result) {
				      console.log("Citation ajoutée");
				  });
			      }
			      response.interdit = result[0].interdit;
			      response.mots_interdits = result[0].mots_interdits;
			      response.cit_libelle = result[0].cit_libelle;
			      response.liste_salaries = result[1];
			      response.render("ajouterCitation", response);
			  });
  };


  // ////////////////////////////////////////////// S U P P R I M E R   U N E   N O T E

  module.exports.SupprimerNote = 	function(request, response){
       response.title = 'Ajouter des citations';
       model_vote.deleteVote(request.params.cit_num, request.session.per_num, function(err, result) {
         if (!err) {
           response.redirect('/listerCitation');
        }
        else
          console.log(err);
       });

    } ;


// ////////////////////////////////////////////// R E C H E R C H E R     C I T A T I O N

module.exports.RechercherCitation = function(request, response){
   response.title = 'Rechercher des citations';
   response.render('rechercherCitation', response);


  } ;
