var model = require('../models/ville.js');
   
   // ////////////////////////////////////////////// L I S T E R     V I L L E S 
     
module.exports.ListerVille = function(request, response){
   response.title = 'Liste des villes';
	if(request.session.betisier){response.login=request.session.betisier}
     
   model.getListeVille( function (err, result) {
        if (err) {
            // gestion de l'erreur
            return;
        }
   response.listeVille = result; 
   response.nbVille = result.length;
   response.render('listerVille', response);
        });   
};   

   // ////////////////////////////////////////////// A J O U T E R     V I L L E
   
module.exports.AjouterVille = function(request, response){

   response.title = 'Ajouter des villes';
	
   response.render('ajoutVille', response);
};  
 
   // ////////////////////////////////////////////// I N S E R E R     V I L L E 
 
module.exports.InsertVille = function(request, response){
    response.title = 'Insertion d\'une ville'; 
 
 	response.render('ajoutVille', response);
};

   // ////////////////////////////////////////////// M O D I F I E R     V I L L E S 
     
module.exports.ModifierVille = function(request, response){
   response.title = 'Modifier une ville';
   response.render('modifierVille', response);
}; 

