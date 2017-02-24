host='127.0.0.1';
port=9443;
selfId='';
token='';
orgId='';
messages=[];

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
		isConnected = true;
		console.log('Handshake complete, readyState = ' + socket.readyState);
		console.log('Handshake complete, protocol selected by the server = ' + socket.protocol);
		if(messages.length > 0) {
			for (var i = 0; i < messages.length; i++) {
				socket.send(JSON.stringify(messages[i]));
				
			}
		}
		// TODO: Write reconnection functionality
	}

	socket.onmessage = function(event) {
		var response = JSON.parse(event.data);
		if (!response.hasOwnProperty('topic')) {
			return;
		}
		if (subscriptionMap.get(response['topic']) != undefined) {
			subscriptionMap.get(response['topic'])(response);
		}
	}

	socket.onerror = function(event) {
		console.log('An error occurred: ' + JSON.parse(event.data));
	}

	socket.onclose = function(event) {
		console.log('Closing the connection: ' + JSON.parse(event.data));
		socket.close();
		isConnected = false;
	}

	// Public accessors

	this.getSocket = function() {
		return socket;
	}
}


TopicClientInstance.prototype = {
	constructor: TopicClientInstance,


	sendMessage: function(msg) {
		msg['origin'] = selfId + '/.';
		var socket = this.getSocket();
		if(isConnected) {
			socket.send(JSON.stringify(msg));
		}
		else {
			messages.push(msg);
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
	},

	unsubscribe: function(path) {
		if (subscriptionMap.get(path) != undefined) {
			subscriptionMap.remove(path);
			data = {};
			targets = [path];
			data['targets'] = targets;
			data['msg'] = 'unsubscribe';
			this.sendMessage(data);
			console.log("Unsubscribing: " + path);
		}
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
		console.log("Intantiating TopicClient!!");
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

