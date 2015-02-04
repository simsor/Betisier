
var model = require('../models/personne.js');


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

// ////////////////////////////////////////////// A J O U T E R     P E R S O N N E S

module.exports.AjouterPersonne = function(request, response){
   response.title = 'Ajout des personnes';

   response.render('ajouterPersonne', response);
};
