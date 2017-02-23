host='127.0.0.1';
port=9443;
selfId='';
token='';
orgId='';

function TopicClientInstance() {
	console.log("TopicClient has been instantiated!!");
}

TopicClientInstance.prototype = {
	constructor: TopicClientInstance,

	subscribe: function(path, callback) {
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



function doHandshake(webSocket, message) {
	// Construct a message object containing the data the server needs
	var msg = {
		"targets": [""],
		"msg": "query",
		"request": "1",
		"origin": "/."
	};

	console.log('Sending message: ' + JSON.stringify(msg));
	webSocket.send(JSON.stringify(msg));
}

function requestSubscription(webSocket, subscriptionType) {
	// Construct a query object containing the type of connection that is desired

	var msg = {
		"targets": [subscriptionType],
		"msg": "subscribe",
		"origin": "/."
	};
	webSocket.send(JSON.stringify(msg));
}

function sayHelloToIntu(message) {
	var intuSocket = new WebSocket('ws://' + host + ':' + port + '/stream?selfId='
				       + selfId + '&orgId=' + orgId + '&token=' + token);

	intuSocket.onopen = function(event) {
		console.log('Performing handshake:' + intuSocket.toString());
		doHandshake(intuSocket, message);
		console.log('Handshake complete, readyState = ' + intuSocket.readyState);
		console.log('Protocol selected by the server = ' + intuSocket.protocol);
		console.log('Subscribing to the log');
		requestSubscription(intuSocket, 'log');
		console.log('Subscribing to the blackboard stream');
		requestSubscription(intuSocket, 'blackboard-stream');
	}

	intuSocket.onmessage = function(event) {
		console.log('Received a response from the server!');
		console.log(JSON.parse(event.data));
	}

	intuSocket.onerror = function(event) {
		console.log('An error occurred: ' + JSON.parse(event.data));
	}

	intuSocket.onclose = function(event) {
		console.log('Closing the connection: ' + JSON.parse(event.data));
		intuSocket.close();
	}
}
