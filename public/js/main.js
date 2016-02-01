/*var socket = io.connect("http://localhost:3000/");
socket.on('connected', function () {
	console.log('Conectado!');
});
socket.on('disconnect', function () {
	console.log('Desconectado!');
});
socket.on('mensaje', function () {
	console.log('Desconectado!');
});
*/

var socket = io.connect();
/*socket.on('tweet', function (data) {
	$("#listado_busquedas").prepend("<li class='list-group-item'><img src='"+data.img_perfil+"'> @"+data.user+" :"+data.text+"</li>");
	//console.log(data.user);
});*/

$(document).on("ready",function(){

	//$("body").prepend(alerta());
	$("#resultado_busqueda_general").prepend(loader());

$('#buscador_global').keypress(function(e){
	var self = $(this);

	if( self.val() != "" && e.keyCode == 13 ){
		$("#loader").show("fast");
		$("#resultado_busqueda_general").slideDown("fast");
		socket.emit('busqueda_general', { parametro: self.val() });
		
		socket.on('tweet', function (data) {
			//console.log(data);
			var html_busqueda  = '<div class="media" style="border:1px solid lightgray;padding:1em;"><div class="media-left"><a href="#">';
			  	html_busqueda += '<img class="media-object img img-circle" src="'+data.img_perfil+' "></a></div>';
			  	html_busqueda += '<div class="media-body"><h4 class="media-heading">@'+data.user+'</h4>';
			  	html_busqueda += '<p>'+data.text+'</p></div></div>';
  			

			$("#resultado_busqueda_general").prepend(html_busqueda);
			
			$("#loader").fadeOut("fast");

		});
	}

});
	/*Buscador Detallado*/
	var contador_items_busquedas = 0;

	$('#cantidad_tweets').keypress(function(e){
		keynum = window.event ? window.event.keyCode : e.which;
		if ((keynum == 8) || (keynum == 13))
			return true;
		return /\d/.test(String.fromCharCode(keynum));
	}).attr("maxlength","10");

/*******************************************Validación de busquedas multiples*************************************************/

	$("#enviar_busqueda").on("click",function(e){
		e.preventDefault();


		var nombre_busqueda        = $('#nombre');
		var palabras 		       = $('#palabras');
		var frases 			       = $('#frases');
		var algunas_estas_palabras = $('#algunas_estas_palabras');
		var ninguna_estas_palabras = $('#ninguna_estas_palabras');
		var hashtags 			   = $('#hashtags');
		var usuario 			   = $('#usuario');
		var geolocalizacion   	   = $('#geolocalizacion');

		var disparador_alerta = $('#cantidad_tweets');
		var duracion_alerta   = $('#intervalo');

		$(".focus_toggle").on("focus",function(){
			$("#mensaje_busqueda").fadeOut();
		});
		
		if(nombre_busqueda.val() == ""){
			$("#mensaje_busqueda").fadeIn().html("Debe ingresar un nombre para guardar la busqueda");
			return false;
		}else if(disparador_alerta.val() == ""){
			$("#mensaje_busqueda").fadeIn().html("Debe ingresar un limite de tweets para la alerta");
			return false;
		}
		else{

			//if(palabras.val() != "" || frases.val() != "" || geolocalizacion.val() != ""){
			if(palabras.val() != "" || frases.val() != "" || algunas_estas_palabras.val() != "" || ninguna_estas_palabras.val() != "" || hashtags.val() != "" || usuario.val() != "" || geolocalizacion.val() != "" ){

				contador_items_busquedas++;
				
				if(contador_items_busquedas <= 3){
				var item_busqueda  = "<li class='list-group-item' id='itemBusqueda_"+contador_items_busquedas+"'>"+nombre_busqueda.val();
					item_busqueda += "<span class='badge eliminar_busqueda' style='cursor:pointer;' title='eliminar'><span class='glyphicon glyphicon-remove'></span></span>";
					item_busqueda += "</li>";//<span class='badge editar_busqueda' style='cursor:pointer;' title='editar'><span class='glyphicon glyphicon-pencil'></span></span>

				/*var alerta_item_busqueda  = "<li class='list-group-item' id='itemAlerta_"+contador_items_busquedas+"'  style='overflow:hidden;'>";
					alerta_item_busqueda +=	"<div style='float:left;width: 70%;'>"+nombre_busqueda.val()+" - Tweet Alert: "+disparador_alerta.val()+"</div>";
					alerta_item_busqueda +=	"<div style='float:right;margin-left:1em;'><span class='badge editar_alerta' style='cursor:pointer;' title='Editar Alerta'><span class='glyphicon glyphicon-pencil'></span></span>";
					alerta_item_busqueda +=	"<span class='badge eliminar_alerta' style='cursor:pointer;' title='Eliminar Alerta'><span class='glyphicon glyphicon-remove'></span></span><div></li>";
				*/
				var detalle_item_busqueda  = "<li class='list-group-item' id='itemDetalle_"+contador_items_busquedas+"' style='cursor:pointer;display:none;' >";
					detalle_item_busqueda += "<div class='detalle_list' style='padding:5px;overflow:hidden;'><div style='float:left;width: 70%;'>"+nombre_busqueda.val()+"</div><div style='float:right;margin-left:1em;'><span class='badge item_contador' style='float:right;'></span></div></div>";
					detalle_item_busqueda += "<div class='view_detalle' style='max-height:400px;border-top:1px dotted gray;padding:5px;overflow-y:scroll;'></div>";
					detalle_item_busqueda += "</li>";
				

				$("#listado_busquedas").prepend(item_busqueda);
				$("#listado_busquedas_detalle").prepend(detalle_item_busqueda);
/*********************************************Emisión de las busquedas multiples********************************/				
	
	socket.emit('busqueda_multiple_'+contador_items_busquedas, { 
		//parametro 	  : palabras.val(),
		parametro 		: [palabras.val(), frases.val(), algunas_estas_palabras.val(), ninguna_estas_palabras.val(), hashtags.val(), usuario.val(), geolocalizacion.val()],
		alerta 			: disparador_alerta.val(),
		nombre_busqueda : nombre_busqueda.val()
	});
		socket.on('tweets_'+contador_items_busquedas, function (data) {
			//console.log(data);
		var html_busquedas  = '<div class="media items_buscadores" style="border:1px solid lightgray;padding:1em;"><div class="media-left"><a href="#">';
		  	html_busquedas += '<img class="media-object img img-circle" src="'+data.img_perfil+' "></a></div>';
		  	html_busquedas += '<div class="media-body"><h4 class="media-heading">@'+data.user+'</h4>';
		  	html_busquedas += '<p>'+data.text+'</p></div></div>';
	

  		if(data.num_tweets == data.alerta ){

			var alerta_item_busqueda  = "<li class='list-group-item alerta_hover' id='itemAlerta_"+contador_items_busquedas+"'  style='overflow:hidden;cursor:pointer' title='Ver todos los tweets de la alerta'>";
			alerta_item_busqueda +=	"<div style='float:left;width: 70%;'>"+data.nombre+" -# Alert Tweet: "+data.alerta+"</div>";
			//alerta_item_busqueda +=	"<div style='float:right;margin-left:1em;'><span class='badge editar_alerta' style='cursor:pointer;' title='Editar Alerta'><span class='glyphicon glyphicon-pencil'></span></span>";
			alerta_item_busqueda +=	"<span class='badge eliminar_alerta' style='cursor:pointer;' title='Eliminar Alerta'><span class='glyphicon glyphicon-remove'></span></span><div></li>";	

			$("#listado_alertas").prepend(alerta_item_busqueda);
			//$(".items_buscadores").show("fast");
			$("#itemAlerta_"+contador_items_busquedas).on("click",function(){
				$("#itemDetalle_"+contador_items_busquedas).show("fast");
			});

		}	

		$("#panel_alertas #listado_alertas ").on("click","li .eliminar_alerta",function(){
			$(this).parent().remove();
			//console.log("jfngjfdngjkndfjkngjknfk");
		});			


		$("#listado_busquedas_detalle #itemDetalle_"+contador_items_busquedas+" span.item_contador").html(data.num_tweets);
		$("#listado_busquedas_detalle #itemDetalle_"+contador_items_busquedas+" .view_detalle").prepend(html_busquedas);

	});
	

/*********************primer emit estatico*************************
	socket.emit('busqueda_multiple_1', { 
		parametro 		: palabras.val(),
		alerta 			: parseInt(disparador_alerta.val()),
		nombre_busqueda : nombre_busqueda.val()
	});
		socket.on('tweets_1', function (data) {
			//console.log(data);
		var html_busquedas  = '<div class="media" style="border:1px solid lightgray;padding:1em;"><div class="media-left"><a href="#">';
		  	html_busquedas += '<img class="media-object img img-circle" src="'+data.img_perfil+' "></a></div>';
		  	html_busquedas += '<div class="media-body"><h4 class="media-heading">@'+data.user+'</h4>';
		  	html_busquedas += '<p>'+data.text+'</p></div></div>';
	
  		if(data.num_tweets > data.alerta ){
  			$("#alarma").show("fast");
  		}

		$("#listado_busquedas_detalle #itemDetalle_"+contador_items_busquedas+" span.item_contador").html(data.num_tweets);
		$("#listado_busquedas_detalle #itemDetalle_"+contador_items_busquedas+" .view_detalle").prepend(html_busquedas);

	});

	socket.emit('busqueda_multiple_2', { 
		parametro 		: palabras.val(),
		alerta 			: parseInt(disparador_alerta.val()),
		nombre_busqueda : nombre_busqueda.val()
	});
		socket.on('tweets_2', function (data) {
			//console.log(data);
		var html_busquedas  = '<div class="media" style="border:1px solid lightgray;padding:1em;"><div class="media-left"><a href="#">';
		  	html_busquedas += '<img class="media-object img img-circle" src="'+data.img_perfil+' "></a></div>';
		  	html_busquedas += '<div class="media-body"><h4 class="media-heading">@'+data.user+'</h4>';
		  	html_busquedas += '<p>'+data.text+'</p></div></div>';
	
  		if(data.num_tweets > data.alerta ){
  			$("#alarma").show("fast");
  		}

		$("#listado_busquedas_detalle #itemDetalle_"+contador_items_busquedas+" span.item_contador").html(data.num_tweets);
		$("#listado_busquedas_detalle #itemDetalle_"+contador_items_busquedas+" .view_detalle").prepend(html_busquedas);

	});

	socket.emit('busqueda_multiple_3', { 
		parametro 		: palabras.val(),
		alerta 			: parseInt(disparador_alerta.val()),
		nombre_busqueda : nombre_busqueda.val()
	});
		socket.on('tweets_3', function (data) {
			//console.log(data);
		var html_busquedas  = '<div class="media" style="border:1px solid lightgray;padding:1em;"><div class="media-left"><a href="#">';
		  	html_busquedas += '<img class="media-object img img-circle" src="'+data.img_perfil+' "></a></div>';
		  	html_busquedas += '<div class="media-body"><h4 class="media-heading">@'+data.user+'</h4>';
		  	html_busquedas += '<p>'+data.text+'</p></div></div>';
	
  		if(data.num_tweets > data.alerta ){
  			$("#alarma").show("fast");
  		}

		$("#listado_busquedas_detalle #itemDetalle_"+contador_items_busquedas+" span.item_contador").html(data.num_tweets);
		$("#listado_busquedas_detalle #itemDetalle_"+contador_items_busquedas+" .view_detalle").prepend(html_busquedas);

	});		
*********************Tercer emit estatico*************************/

/*********************************************Emisión de las busquedas multiples********************************/

				$(".eliminar_busqueda").on("click",function(){
					var identificador_iten_busqueda = $(this).parent().attr("id");
					
					var numero_item = identificador_iten_busqueda.split("_");

					$(this).parent().remove();
					$("#itemAlerta_"+numero_item[1]).remove();
					$("#itemDetalle_"+numero_item[1]).remove();
					contador_items_busquedas--;
				});
				

				$(".list-group-item .detalle_list").on("click",function(){
					//$(this).unbind("click");
					$(this).siblings(".view_detalle").slideToggle("fast");
					console.log($(this).siblings(".view_detalle"));
				});

				/*Limpieza de campos*/
				nombre_busqueda.val("");
				palabras.val("");
				frases.val("");
				geolocalizacion.val("");
				disparador_alerta.val("");
				duracion_alerta.val("");
				/*Limpieza de campos*/
			}else{
				$("#mensaje_busqueda").fadeIn().html("El limite de busquedas en simultaneo es de 3");
				return false;
			} //maximo hasta 5

			}else{
				$("#mensaje_busqueda").fadeIn().html("Debe ingresar por lo menos un criterio de busqueda");
				return false;
			} //If-else interno
			$("#mensaje_busqueda").hide();
		}//else
		

	});//Busqueda especifica
/*******************************************Validación de busquedas multiples*************************************************/

});


function loader(){
	return "<div id='loader' style='display:none;position:absolute;top:0;left:0;z-index:10000;width:100%;height:100%;background:rgba(255,255,255,0.5);'><img style='display:block;margin:auto;position:absolute;top:0;left:0;right:0;bottom:0;' src='/img/loader.gif'></div>";
}

/*function alerta(){
	return "<div id='alarma' style='display:none;position:fixed;top:0;left:0;z-index:10000;width:100%;height:100%;background:rgba(255,255,255,0.5);'><div id='mensajero_alarma' style='width:330px;height:200px;text-align:center;font-size:1.3em;padding:1em;background:#f1f1f1;margin:auto;position:absolute;top:0;left:0;right:0;bottom:0;'></div></div>";
}*/