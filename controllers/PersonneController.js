
var model = require('../models/personne.js');
  
    
// ////////////////////////////////////////////// L I S T E R     P E R S O N N E S 
   
module.exports.ListerPersonne = function(request, response){
   response.title = 'Liste des personnes';

   response.render('listerPersonne', response);  
};   
