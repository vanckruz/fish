var sockect = io.connect("http://localhost:3000/");
socket.on('connected', function () {
	console.log('Conectado!');
});
socket.on('disconnect', function () {
	console.log('Desconectado!');
});
socket.on('mensaje', function () {
	console.log('Desconectado!');
});