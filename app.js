var express         = require('express'),
    session         = require('express-session'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'), //pour récuperer les résultats des post
	 handlebars  	  = require('express-handlebars'), hbs,
	 http = require('http'),
	 path = require('path'),
	 fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 6800);
app.set('views', path.join(__dirname, 'views'));
app.use('/image',express.static(path.join(__dirname+ '/public/image')));
app.use('/css',express.static(path.join(__dirname+'/public/css')));
app.use(cookieParser());

app.use(session({
    secret: 'nC0@#1pM/-0qA1+é',
    name: 'Betisier',
    // store: sessionStore, // connect-mongo session store
    // proxy: true,
    resave: true,
    saveUninitialized: true
}));

// secure : true pour httpS
 
/* express-handlebars - https://github.com/ericf/express-handlebars
A Handlebars view engine for Express. */
hbs = handlebars.create({
   defaultLayout: 'main', // nom de la page par defaut ici main.handlebars
   
   partialsDir: ['views/partials/']
});
 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// send app to router
require('./router')(app); 


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

