
// Convertisseur de date
module.exports.getFrenchDate = function(isoDate) {
    var vals = isoDate.split("-");
    if (vals.length != 3)
	return false;
    
    return vals[2] + "/" + vals[1] + "/" + vals[0];
};

module.exports.getIsoDate = function(frenchDate) {
    var vals = frenchDate.split("/");
    if (vals.length != 3)
	return false;

    return vals[2] + "-" + vals[1] + "-" + vals[0];
};

module.exports.getRandomInt = function(min, max) {
    return Math.floor(Math.random()*(max-min))+min;
};
