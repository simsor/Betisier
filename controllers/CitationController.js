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
       model_vote.deleteVote(request.params.cit_num, request.session.per_num, function(err, result) {
         if (!err) {
           response.redirect('/listerCitation');
        }
        else {
          console.log(err);
        }
        });
      };

// ////////////////////////////////////////////// F O R M U L A I R E   N O U V E L L E   N O T E

module.exports.ModifierNote = 	function(request, response){
         response.title = 'Modifiez votre note';
         response.render('modifierVote', response);
};


// ////////////////////////////////////////////// U P D A T E   U N E   N O T E

module.exports.NoteOK = 	function(request, response){
    var note = request.body.vot_valeur;

    if (note <= 20 && note >= 0) {
	model_vote.addVote(request.params.cit_num, request.session.per_num, request.body.vot_valeur, function(err, result) {
	    if (!err) {
		response.voteModifie = true;
	    }
	    else{
		response.voteModifie = false;
		console.log(err);
	    }
	    response.render('modifierNoteOK', response);
	});
    }
    else {
	response.voteModifie = false;
	response.render("modifierNoteOK", response);
    }
};


// ////////////////////////////////////////////// R E C H E R C H E R     C I T A T I O N

module.exports.FormulaireRechercherCitation = function(request, response){
    response.title = 'Rechercher des citations';
    async.parallel([

	function(callback) {
	    // Liste des enseignants ayant des citations validées
	    model_salarie.getSalariesAvecCitationValidee(function(err, result) {
		if (err) {
		    callback(err);
		    return;
		}

		callback(null, result);
	    });
	},

	function(callback) {
	    // Liste des dates des citations validées
	    model.getListeCitationsValidees(function(err, result) {
		if (err) {
		    callback(err);
		    return;
		}
		var dates = [];
		var votes = [];
		for (var i=0; i < result.length; i++) {
		    if (dates.indexOf(result[i].cit_date) == -1) {
			// Si la date n'est pas déjà dans le tableau
			dates.push(result[i].cit_date);
		    }

		    if(votes.indexOf(result[i].moyenne) == -1) {
			// Si la note n'est pas déjà dans le tableau
			votes.push(result[i].moyenne);
		    }
		}
		callback(null, [dates, votes]);
	    });
	}
	
    ], function(err, result) {
	if (!err) {
	    response.salaries = result[0];
	    response.dates = result[1][0];
	    response.moyennes = result[1][1];
	}
	else {
	    console.log(err);
	    return;
	}

	response.render("rechercherCitation", response);
    }); 
};


module.exports.RechercherCitation = function(request, response) {
    response.title = "Rechercher des citations";
    
    model.rechercherCitation(request.body.per_num, request.body.cit_date, request.body.moyenne, function(err, result) {
	if (err) {
	    console.log(err);
	    return;
	}

	response.citations = result;

	response.render("resultatRecherche", response);
    });
};

// ////////////////////////////////////////////// V A L I D E R    C I T A T I O N
module.exports.ValiderCitation = function(request, response) {
    response.title = "Valider une citation";

    model.getListeCitationsNonValidees(function(err, result) {
	if (err) {
	    console.log(err);
	    return;
	}

	response.citations = result;
	response.render('validerCitation', response);
    });
};

module.exports.ValiderCitationOK = function(request, response) {
    var cit_num = request.params.cit_num || -1;
    if (cit_num == -1)
	return response.redirect("/");

    var per_num = request.session.per_num;

    model.validerCitation(cit_num, per_num, function(err, result) {
	if (err) {
	    console.log(err);
	    return; 
	}

	response.redirect("/validerCitation");
    });
};

module.exports.SupprimerCitation = function(request, response) {
    var cit_num = request.params.cit_num || -1;
    var page = request.params.page || "listerCitation";
    if (cit_num == -1)
	return response.redirect("/");

    model.supprimerCitation(cit_num, function(err, result) {
	if (err) {
	    console.log(err);
	    return;
	}

	response.redirect("/" + page);
    });
};
