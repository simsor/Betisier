var model = require('../models/ville.js');

   // ////////////////////////////////////////////// L I S T E R     V I L L E S

/*
* Ce module permet de récupérer l'intégralité des Villes
* en utilisant la méthode getListVille du model ville.js
* il passe listeVille  et nbVille à la vue listerVille.
* response.listeVille contient par exemple :
* [ { vil_num: 5, vil_nom: 'Tulle' },
* { vil_num: 6, vil_nom: 'Brive' },
* { vil_num: 17, vil_nom: 'Orléans' } ]

* response.nbVille contient par exemple : 3
* response.title est passé à main.handlebars via la vue listerVille
* il sera inclus dans cette balise : <title> {{title}}</title>
*/

module.exports.ListerVille = function(request, response){
   response.title = 'Liste des villes';

   model.getListeVille( function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
   response.listeVille = result;
   response.nbVille = result.length;
   response.render('listerVille', response);
        });
};

   // ////////////////////////////////////////////// A J O U T E R     V I L L E

module.exports.AjouterVilleOk = function(request, response){

   response.title = 'Ajouter une ville';

   model.addVille(request.body.vil_nom, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            response.villeOk = false;
        }
        else {
          response.villeOk = true;
          response.vil_nom = request.body.vil_nom;
        }
        response.render('ajoutVilleOk', response);
    });
};

// ////////////////////////////////////////////// A J O U T E R     V I L L E    F O R M U L A I R E

module.exports.AjouterVille = function(request, response){

response.title = 'Ajouter une ville';
response.render('ajoutVille', response);

};

   // ////////////////////////////////////////////// M O D I F I E R     V I L L E

module.exports.ModifierVille = function(request, response){
   response.title = 'Modifier une ville';
   response.render('modifierVille', response);
};

// ////////////////////////////////////////////// S U P P R I M E R   U N E   V I L L E

module.exports.SupprimerVille = 	function(request, response){
     model.deleteVille(request.params.vil_num, function(err, result) {
       if (!err) {
         response.redirect('/listerVille');
      }
      else {
        console.log(err);
      }
      });
    };
