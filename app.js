var express         = require('express'),
    session         = require('express-session'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'), //pour récupérer les résultats des post
    handlebars      = require('express-handlebars'), hbs,
    http            = require('http'),
    path            = require('path');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 6800);
app.set('views', path.join(__dirname, 'views'));

// routes static, le routeur n'y aura pas accès
app.use('/image',express.static(path.join(__dirname+ '/public/image')));
app.use('/css',express.static(path.join(__dirname+'/public/css')));
app.use('/son',express.static(path.join(__dirname+'/public/son')));

app.use(cookieParser());

app.use(session({
    secret: 'nC0@#1pM/-0qA1+é',
    name: 'Betisier',
    resave: true,
    saveUninitialized: true
}));

 
/* express-handlebars - https://github.com/ericf/express-handlebars
*  Handlebars : moteur de template pour Express.
* il va gérer les vues
*/
hbs = handlebars.create({
   defaultLayout: 'main', // nom de la page par defaut ici main.handlebars (structure de base HTML)
   
   partialsDir: ['views/partials/'] // le vues partielles (le code HTML qui se répète dans toutes les pages)
   // les vues qui changent suivant le choix de l'utilisateur sont à la racine du répertoire : views
});
 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// On permet d'accéder aux variables de session depuis les templates
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

// chargement du routeur
require('./router/router')(app); 

http.createServer(app).listen(app.get('port'), function(){
  console.log('Serveur Node.js en attente sur le port ' + app.get('port'));
});

