
var model = require('../models/personne.js');
var model_division = require('../models/division');
var model_departement = require('../models/departement');
var model_fonction = require('../models/fonction');
var model_etudiant = require('../models/etudiant');
var model_salarie = require('../models/salarie');

// Fonction permettant de réunir les propriétés de différents objets
function collect() {
  var ret = {};
  var len = arguments.length;
  for (var i=0; i<len; i++) {
    for (p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p)) {
        ret[p] = arguments[i][p];
      }
    }
  }
  return ret;
}


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
        model_fonction.getAllFonction(function(err, result) {
          if (err) {
            console.log(err);
            return;
          }
          response.liste_fonctions = result;
          response.render('ajouterSalarie', response);
      });
    }
  }
  else if (request.body.per_nom == undefined && request.body.div_num != undefined){
    var data = collect(session.personne_contenu, request.body);
    model_etudiant.addEtudiant(data, function(err, result) {
      response.estEtudiant=true;
      response.typePersonne="étudiant";
      if (!err) {
        response.error = false;
      }
      else {
        response.error = true;
        console.log(err);
      }
      response.render('ajoutPersonnelOk', response);
    });

  }
  else if (request.body.per_nom == undefined && request.body.sal_telprof != undefined) {
    var data = collect(session.personne_contenu, request.body);
    model_salarie.addSalarie(data, function(err, result) {
      response.estEtudiant=false;
      response.typePersonne="salarié";
      if (!err) {
        response.error = false;
      }
      else {
        response.error = true;
        console.log(err);
      }

      response.render('ajoutPersonnelOk', response);
    });
  }
};
