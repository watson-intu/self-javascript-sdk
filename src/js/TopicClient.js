host='127.0.0.1';
port=9443;
selfId='';
token='';
orgId='';

function TopicClientInstance() {
	this.socket = new WebSocket('ws://' + host + ':' + port + '/stream?selfId=' + selfId + '&orgId=' + orgId + '&token=' + token);
	this.socket.onopen = function(event) {
		console.log('Performing handshake:');
		doHandshake(this.socket, message);
		console.log('Handshake complete, readyState = ' + this.socket.readyState);
		console.log('Protocol selected by the server = ' + this.socket.protocol);
		console.log('Subscribing to the log');
		requestSubscription(this.socket, 'log');
		console.log('Subscribing to the blackboard stream');
		requestSubscription(this.socket, 'blackboard-stream');
	}

	this.socket.onmessage = function(event) {
		console.log('Received a response from the server!');
		console.log(JSON.parse(event.data));
	}

	this.socket.onerror = function(event) {
		console.log('An error occurred: ' + JSON.parse(event.data));
	}

	this.socket.onclose = function(event) {
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
	},

	doHandshake: function() {
		var msg = {
			"targets": [""],
			"msg": "query",
			"request": "1",
			"origin": "/."
		};

		this.socket.send(JSON.stringify(msg));
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

