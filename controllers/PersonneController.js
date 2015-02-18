
var model = require('../models/personne.js');
var model_division = require('../models/division');
var model_departement = require('../models/departement');


// ////////////////////////////////////////////// L I S T E R     P E R S O N N E S

module.exports.ListerPersonne = function(request, response){
   response.title = 'Liste des personnes';
   model.getListePersonne(function (err, result) {
     if (err) {
        console.log(err);
        return
     }
     response.nbPersonnes = result.length;
     response.listePersonne = result;
     response.render('listerPersonne', response);
   });
};

// ////////////////////////////////////////////// D E T A I L     P E R S O N N E

module.exports.DetailPersonne = function(request, response){
   response.title = 'Détail de la personne';
   model.getDetailPersonne(request.params.num, function (err, result) {
     if (err) {
        console.log(err);
        return
     }
     response.isEtudiant = result[0]['dep_nom'] != undefined;
     response.donnees = result[0];

     response.render('detailPersonne', response);
   });
};

// ////////////////////////////////////////////// A J O U T E R     P E R S O N N E S    F O R M U L A I R E

module.exports.AjouterPersonne = function(request, response){
   response.title = 'Ajout des personnes';

   response.render('ajouterPersonne', response);
};

// ////////////////////////////////////////////// A J O U T E R     P E R S O N N E S

module.exports.AjouterPersonneOk = function(request, response){
    var session = request.session;
    response.title = 'Ajout des personnes';

    console.log("request.body.per_nom == undefined => " + request.body.per_nom == undefined);

    if (request.body.per_nom != undefined) {
      session.personne_contenu = request.body;

      if (request.body.categorie == "etudiant") {
        model_division.getAllDivision(function(err, result) {
          if (err) {
            console.log(err);
            return;
          }
          var toutes_divisions = result;
          model_departement.getAllDepartement(function(err, result) {
            if (err) {
              console.log(err);
              return;
            }
            response.liste_divisions = toutes_divisions;
            response.liste_departements = result;
            response.render('ajouterEtudiant', response);
          });
        });
      }
      else {
        response.render('ajouterPersonnel', response);
      }
  }
  else if (request.body.per_nom == undefined && request.body.div_num != undefined){
    // On ajoute un étudiant
    
  }
  else if (request.body.per_nom == undefined && request.body.sal_telprof != undefined) {
    // On ajoute un personnel
  }
};
