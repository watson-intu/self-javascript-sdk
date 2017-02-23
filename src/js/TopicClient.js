host='127.0.0.1';
port=9443;
selfId='';
token='';
orgId='';

function TopicClientInstance() {
	// TODO: The path to the WebSocket server could be an argument
	var socket = new WebSocket('ws://' + host + ':' + port + '/stream?selfId=' + selfId + '&orgId=' + orgId + '&token=' + token);

	socket.onopen = function(event) {
		console.log('Performing WebSocket handshake:');
		var msg = {
			"targets": [""],
			"msg": "query",
			"request": "1",
			"origin": "/."
		};

		socket.send(JSON.stringify(msg));
		console.log('Handshake complete, readyState = ' + socket.readyState);
		console.log('Handshake complete, protocol selected by the server = ' + socket.protocol);
	}

	socket.onmessage = function(event) {
		console.log('Received a response from the server!');
		console.log(JSON.parse(event.data));
	}

	socket.onerror = function(event) {
		console.log('An error occurred: ' + JSON.parse(event.data));
	}

	socket.onclose = function(event) {
		console.log('Closing the connection: ' + JSON.parse(event.data));
		socket.close();
	}

	console.log("TopicClient has been instantiated!!");
}


TopicClientInstance.prototype = {
	constructor: TopicClientInstance,

	subscribe: function(path, callback) {
		var msg = {
			"targets": [subscriptionType],
			"msg": "subscribe",
			"origin": "/."
		};
		this.socket.send(JSON.stringify(msg));
		console.log("TopicClient subscription called!");
	},

	unsubscribe: function(path) {
		var msg = {
			"msg" : "unsubscribe"
		};

		console.log("Unsubscribing: " + path);
	},

	publish: function(path, msg, persisted) {
		console.log("TopicClient publishing data!");
	},

	onPong: function(buffer) {
		console.log("TopicClient onPong called");
	}
}


var TopicClient = (function () {
	var instance;

	function createInstance() {
		var object = new TopicClientInstance();
		return object;
	}

	return {
		getInstance: function() {
			if(!instance) {
				instance = createInstance();
			}

			return instance;
		}
	};
})();

