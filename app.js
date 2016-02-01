var util    = require('util'),
path        = require('path'),
express     = require('express'), 
http        = require('http'),
app         = express(),
server      = http.createServer(app),
twitter     = require('ntwitter');


/***********************************Mysql***********************************************
mysql       = require('mysql');
  var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'hashtagtool'
});
 
connection.connect();
connection.end(); 
/************************************Mysql**********************************************/

//configuración de los datos de nuestra app de twitter
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

//server.listen(process.env.PORT);
server.listen(3000);
var io  = require("socket.io").listen(server);
/*Configuraciones de la aplicación*/ 
app.use(express.static(path.join(__dirname, 'public')));
 
app.set("views",__dirname + "/views");

app.configure(function(){
    app.use(express.static(__dirname));
});


var bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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
{       req.session.usuario_logueado = true;
    res.render("index.jade", {title : "Inciar sesión en twitter"});
});

//donde lanzamos al usuario al hacer login
app.get('/login', passport.authenticate('twitter'));

//callback donde nos retorna twitter, debemos decirlo en la conf de la app

app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { successRedirect: '/logeando', failureRedirect: '/login' }),
    function(req, res) 
    {
        //la autentificación ha sido correcta
        //en req.user tenemos todos los datos del usuario logueado
        //console.log(req.user);        
       // req.session.screen_name = ;

       /**Probando la sesion***/
    }
);


 app.get("/logeando", function(req,res)
{    
    req.session.usuario_logueado = true;
    res.redirect('/app');
});


/*Funcionalidad de ntwitter*/
var twitter_oauth = new twitter({
  consumer_key        : "FqwMQS7ptmxHY3MROO0xtpUsu",
  consumer_secret     : "WGjgymhedSg4Z7PFJyjCgsBNsPcXXEpdts1HFOtRBLexNWfTsX",
  access_token_key    : "51280401-YJ8JJLImAlYz7ECM3XqC954kGkTdf69wFEHlErIsB", 
  access_token_secret : "bHaU4qLq7qoOS3P8rdnyp5IyWaLd9CXIH1ZWszt6aeMcs"
});

/*
twitter_oauth
  .verifyCredentials(function (err, data) {
    console.log(data);
  })
  .updateStatus('Test tweet from ntwitter/' + twitter.VERSION,
    function (err, data) {
      console.log(data);
    }
  );

 twitter_oauth.stream('statuses/sample', function(stream) {
    stream.on('data', function (data) {
      console.log(data);
    });
  });
 */

app.get("/app", function(req,res)
{ 
  //console.log(req.user._json);
  //console.log(req.user._json.name);
  //console.log(req.user._json.profile_image_url);
  //console.log(req.user._json.status.profile_background_image_url);
console.log("usuario logueado: "+req.session.usuario_logueado);
if(req.session.usuario_logueado == true){
io.on('connection', function (socket) {
 
  /****Busqueda General****/
  socket.on('busqueda_general', function (data_busqueda_cliente) {
    console.log(data_busqueda_cliente);

      twitter_oauth.stream('statuses/filter',{track:data_busqueda_cliente.parametro} ,function(stream) {
      
        stream.on('data', function (data) {
          //console.log(data);
              
            io.sockets.volatile.emit("tweet",{
              img_perfil : data.user.profile_image_url,
              user       : data.user.screen_name,
              text       : data.text
            });

        });

      });//Stream de twitter

  });
  /****Busqueda General****/

/*********************************busquedas multiples***********************************************/
var busqueda1=0;
var busqueda2=0;
var busqueda3=0;
var busqueda4=0;
var busqueda5=0;
/**************************************Busqueda1*******************************************/
  socket.on('busqueda_multiple_1', function (data) {
     var alarma = data.alerta;
     var nombre_busqueda_remit = data.nombre_busqueda;
     console.log(data);

      twitter_oauth.stream('statuses/filter',{track:data.parametro/*,'locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'*/} ,function(stream) {
      
        stream.on('data', function (data) {
          busqueda1++;
          //console.log(data);
              
            io.sockets.volatile.emit("tweets_1",{
              img_perfil : data.user.profile_image_url,
              user       : data.user.screen_name,
              text       : data.text,
              num_tweets : busqueda1,
              alerta     : alarma,
              nombre     : nombre_busqueda_remit
            });

        });

      });//Stream de twitter

  });
/**************************************Busqueda1*******************************************/

/**************************************Busqueda2*******************************************/
    socket.on('busqueda_multiple_2', function (data) {
      var alarma = data.alerta;
      var nombre_busqueda_remit = data.nombre_busqueda;
      console.log(data);

      twitter_oauth.stream('statuses/filter',{track:data.parametro/*,'locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'*/} ,function(stream) {
      
        stream.on('data', function (data) {
          busqueda2++;
          //console.log(data);
              
            io.sockets.volatile.emit("tweets_2",{
              img_perfil : data.user.profile_image_url,
              user       : data.user.screen_name,
              text       : data.text,
              num_tweets : busqueda2,
              alerta     : alarma,
              nombre     : nombre_busqueda_remit
            });

        });

      });//Stream de twitter

  });
/**************************************Busqueda3*******************************************/

/**************************************Busqueda3*******************************************/
  socket.on('busqueda_multiple_3', function (data) {
    var alarma = data.alerta;
    var nombre_busqueda_remit = data.nombre_busqueda;
    console.log(data);

      twitter_oauth.stream('statuses/filter',{track:data.parametro/*,'locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'*/} ,function(stream) {
      
        stream.on('data', function (data) {
          busqueda3++;
          //console.log(data);
              
            io.sockets.volatile.emit("tweets_3",{
              img_perfil : data.user.profile_image_url,
              user       : data.user.screen_name,
              text       : data.text,
              num_tweets : busqueda3,
              alerta     : alarma,
              nombre     : nombre_busqueda_remit
            });

        });

      });//Stream de twitter

  });
/**************************************Busqueda3*******************************************/

/**************************************Busqueda4*******************************************/
  socket.on('busqueda_multiple_4', function (data) {
      console.log(data);

      twitter_oauth.stream('statuses/filter',{track:data.parametro/*,'locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'*/} ,function(stream) {
      
        stream.on('data', function (data) {
          busqueda4++;
          //console.log(data);
              
            io.sockets.volatile.emit("tweets_4",{
              img_perfil : data.user.profile_image_url,
              user       : data.user.screen_name,
              text       : data.text,
              num_tweets : busqueda4
            });

        });

      });//Stream de twitter

  });
/**************************************Busqueda4*******************************************/

/**************************************Busqueda5*******************************************/
  socket.on('busqueda_multiple_5', function (data) {
      console.log(data);

      twitter_oauth.stream('statuses/filter',{track:data.parametro/*,'locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'*/} ,function(stream) {
      
        stream.on('data', function (data) {
          busqueda5++;
          //console.log(data);
              
            io.sockets.volatile.emit("tweets_5",{
              img_perfil : data.user.profile_image_url,
              user       : data.user.screen_name,
              text       : data.text,
              num_tweets : busqueda5
            });

        });

      });//Stream de twitter

  });
/**************************************Busqueda5*******************************************/
/*********************************busquedas multiples***********************************************/

});
   /* io.on('connection', function (socket) {
      //socket.emit('news', { hello: 'world' });
      socket.on('busqueda_general', function (data) {
        console.log(data);
      });
    });*/

/********************************************Streaming sockets******************************************************/

  res.render("app.jade", 
  {
    title               : "HashtagTool",
    id_user             : req.user._json.id,
    name_user           : req.user._json.name,
    screen_name         : req.user._json.screen_name,
    image_user          : req.user._json.profile_image_url
  });
}else{
      res.redirect('/login');//se redirecciona al inicio
}

});
/*****Fin ruta app*****/

app.post("/app/save_search", function(req,res)
{ 

  var nombre_busqueda = req.body.nombre;

  var palabras        = req.body.palabras;
  var frases          = req.body.frases;
  var geolocalizacion = req.body.geolocalizacion;

  var cantidad_tweets = req.body.cantidad_tweets;
  var intervalo       = req.body.intervalo;
  //var nombre_busqueda = req.body.nombre;

   var fecha = new Date();
   var fecha_busqueda = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate();
   var hora_busqueda  = fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getDate();
 
 
 
  res.send(req.body);


});
/*Funcionalidad de login-twitter*/


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
