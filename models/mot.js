var db = require('../configDb');

module.exports.searchForbiddenWords = function(phrase, callback) {
  db.getConnection(function(err, connexion) {
    var req = "SELECT mot_interdit FROM mot WHERE MATCH(mot_interdit) AGAINST (" + connexion.escape(phrase) + ")";
    connexion.query(req, callback);
    connexion.release();
  });
};
