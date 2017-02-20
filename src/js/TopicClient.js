host='127.0.0.1';
port=9443;
selfId='';
token='';
orgId='';

function sendMessage(webSocket, message) {
	// Construct a message object containing the data the server needs
	var msg = {
		type: 'Message',
		text: message,
	}

	webSocket.send(JSON.stringify(msg));

}

function sayHelloToIntu(message) {
	var intuSocket = new WebSocket('ws://' + host + ':' + port + '/stream?selfId=&orgId=&token=')
	sendMessage(intuSocket, message);
	console.log(intuSocket.toString());

	intuSocket.onmessage = function(event) {
		console.log('Received a response from the server!');
		console.log(JSON.parse(event.data));
	}
}
