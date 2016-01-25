var util    = require('util'),
path        = require('path'),
express     = require('express'), 
http        = require('http'),
app         = express(),
server      = http.createServer(app),
io          = require("socket.io").listen(server),
twitter     = require('ntwitter'),
mysql       = require('mysql');
 
//configuración de los datos de nuestra app de twitter
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

server.listen(process.env.PORT);

/*Configuraciones de la aplicación*/ 
app.use(express.static(path.join(__dirname, 'public')));
 
app.set("views",__dirname + "/views");

app.configure(function(){
    app.use(express.static(__dirname));
});

app.use(express.cookieParser());
app.use(express.session({ secret: 'mysecretsession'})); // session secret
app.use(passport.initialize());
app.use(passport.session());
/*Configuraciones de la aplicación*/ 
 
 
/*Funcionalidad de login-twitter*/
passport.use(new TwitterStrategy({
        consumerKey: 'FqwMQS7ptmxHY3MROO0xtpUsu',
        consumerSecret: 'WGjgymhedSg4Z7PFJyjCgsBNsPcXXEpdts1HFOtRBLexNWfTsX',
        callbackURL: "/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) 
    {
        done(null, profile);
    }
));
 
//serializa el usuario, configuración necesaria para utilizar passport
passport.serializeUser(function(user, done) 
{
  done(null, user);
});
 
//deserializa el usuario, configuración necesaria para utilizar passport
passport.deserializeUser(function(user, done) 
{
  done(null, user);
});
 
 

 app.get("/", function(req,res)
{
    res.render("index.jade", {title : "Inciar sesión en twitter"});
});

//donde lanzamos al usuario al hacer login
app.get('/login', passport.authenticate('twitter'));

//callback donde nos retorna twitter, debemos decirlo en la conf de la app

app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { successRedirect: '/app', failureRedirect: '/login' }),
    function(req, res) 
    {
        //la autentificación ha sido correcta
        //en req.user tenemos todos los datos del usuario logueado
        //console.log(req.user);        
       // req.session.screen_name = ;
    }
);

app.get("/app", function(req,res)
{ 
  console.log(req.user._json);
  console.log(req.user._json.name);
  //console.log(req.user._json.profile_image_url);
  //console.log(req.user._json.status.profile_background_image_url);
  res.render("app.jade", 
  {
    title               : "Twitter login sucessfully",
    id_user             : req.user._json.id,
    name_user           : req.user._json.name,
    screen_name         : req.user._json.screen_name,
    image_user          : req.user._json.profile_image_url
  });
});
/*Funcionalidad de login-twitter*/

/*Funcionalidad de ntwitter*/
var credentialsTwitter = new twitter({
  consumer_key        : "FqwMQS7ptmxHY3MROO0xtpUsu",
  consumer_secret     : "WGjgymhedSg4Z7PFJyjCgsBNsPcXXEpdts1HFOtRBLexNWfTsX",
  access_token_key    : "51280401-YJ8JJLImAlYz7ECM3XqC954kGkTdf69wFEHlErIsB", 
  access_token_secret : "bHaU4qLq7qoOS3P8rdnyp5IyWaLd9CXIH1ZWszt6aeMcs"
});

console.log('Connected to twitter');
 /* 
credentialsTwitter
  .verifyCredentials(function (err, data) {
    console.log(data);
  })
  .updateStatus('Test tweet from ntwitter/' + twitter.VERSION,
    function (err, data) {
      console.log(data);
    }
  );

 credentialsTwitter.stream('statuses/sample', function(stream) {
    stream.on('data', function (data) {
      console.log(data);
    });
  });*/


/*
app.get("/", function(req,res)
{
    //res.render("index.jade", {title : "Twitter in stream with NodeJS, Socket.IO and jQuery"});
});
*/

//más info de status/filter en 
//https://dev.twitter.com/docs/streaming-apis/parameters

/*
io.sockets.on('connection', function(socket) 
{
  credentialsTwitter.stream('statuses/filter', 
  	{
	  	'track':'playstation',//filtramos por la palabra playstation
	  	'filter_level':'medium',//el nivel del filtro
	  	'language':'es,en'//filtramos solo en español y en inglés
	},
    function(stream) 
    {
	    stream.on('data',function(data)
	    {
	      	socket.emit('twitter',data);
	    });
    });
});
*/

//Error: Uncaugght, unspecified "error" event. (http)
//at EvenetEmitter.emit eventjs
