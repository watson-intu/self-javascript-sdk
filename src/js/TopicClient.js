host='127.0.0.1';
port=9443;
selfId='';
token='';
orgId='';

function TopicClientInstance() {
	// Private variables
	// TODO: The path to the WebSocket server could be an argument
	var socket = new WebSocket('ws://' + host + ':' + port + '/stream?selfId=' + selfId + '&orgId=' + orgId + '&token=' + token);

	socket.onopen = function(event) {
		console.log('Performing WebSocket handshake');
		var msg = {
			"targets": [""],
			"msg": "query",
			"request": "1",
			"origin": "/."
		};

		socket.send(JSON.stringify(msg));
		console.log('Handshake complete, readyState = ' + socket.readyState);
		console.log('Handshake complete, protocol selected by the server = ' + socket.protocol);
		// TODO: Write reconnection functionality
	}

	socket.onmessage = function(event) {
		var response = JSON.parse(event.data);
		console.log('Received a response from the server: ' + event.data);
		if (!response.hasOwnProperty('topic')) {
			return;
		}
		if (subscriptionMap.get(response['topic']) != undefined) {
			console.log(response['topic']);
			subscriptionMap.get(response['topic'])(response);
		}
	}

	socket.onerror = function(event) {
		console.log('An error occurred: ' + JSON.parse(event.data));
	}

	socket.onclose = function(event) {
		console.log('Closing the connection: ' + JSON.parse(event.data));
		socket.close();
	}

	// Public accessors

	this.getSocket = function() {
		return socket;
	}

	console.log("TopicClient has been instantiated!!");
}


TopicClientInstance.prototype = {
	constructor: TopicClientInstance,


	sendMessage: function(msg) {
		msg['origin'] = selfId + '/.';
		var socket = this.getSocket();
		socket.onopen = function(data) {
			socket.send(JSON.stringify(msg));
			console.log('Sent message: ' + JSON.stringify(msg));
		}
	},

	subscribe: function(path, callback) {
		if (subscriptionMap.get(path) == undefined) {
			subscriptionMap.put(path, callback);
		}

		data = {};
		targets = [path];
		data['targets'] = targets;
		data['msg'] = 'subscribe';
		this.sendMessage(data);

		console.log("TopicClient subscription called!");
	},

	unsubscribe: function(path) {
		if (subscriptionMap.get(path) != undefined) {
			subscriptionMap.remove(path);
			data = {};
			targets = [path];
			data['targets'] = targets;
			data['msg'] = 'unsubscribe';
			var socket = this.getSocket();
			socket.onopen = function(event) {
				socket.send(JSON.stringify(data));
				console.log('Subscribing: ' + JSON.stringify(data));
			}
			return true;
			console.log("Unsubscribing: " + path);
		}

		return false;
	},

	publish: function(path, msg, persisted) {
		data = {};
		targets = [path];
		data['targets'] = targets;
		data['msg'] = 'publish_at';
		data['data'] = JSON.stringify(msg);
		data['binary'] = false;
		data['persisted'] = persisted;
		this.sendMessage(data);

	},

	publishBinary: function(path, msg, persisted) {

	},

	onPong: function(buffer) {
		console.log("TopicClient onPong called");
	},

	sendBinary: function(payload) {

	},
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

