var db = require('../configDb');

module.exports.getListeVille = function (callback) {	
	db.getConnection(function(err, connexion){
        if(!err){
            connexion.query('SELECT vil_num, vil_nom from ville', callback);
            connexion.release();
         }
      });   
};
