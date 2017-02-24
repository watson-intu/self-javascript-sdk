function GestureManagerInstance() {
}

GestureManagerInstance.prototype = {
	constructor: GestureManagerInstance,

	addGesture: function(gesture, override) {
		var g = gestureMap.get(gesture.gestureId);
		if(g == undefined) {
			if(gesture.onStart()) {
				var msg = {
					"event" : "add_gesture_proxy",
					"gestureId" : gesture.gestureId,
					"instanceId" : gesture.instanceId,
					"override" : override
				};
				topicClient.publish("gesture-manager", msg, false);
				gestureMap.put(gesture.gestureId, gesture);
				gestureOverrideMap.put(gesture.gestureId, override);
			}

		}
	},

	removeGesture: function(gesture) {
		if(gestureMap.get(gesture.gestureId) != undefined) {
			gestureMap.remove(gesture.gestureId);
			gestureOverrideMap.remove(gesture.gestureId);
			var msg = {
				"event" : "remove_gesture_proxy",
				"gestureId" : gesture.gestureId,
				"instanceId" : gesture.instanceId
			};
			topicClient.publish("gesture-manager", msg, false);
		}
	},

	onEvent: function(msg) {
		var payload = JSON.stringify(msg);
		var data = JSON.parse(msg["data"]);
		if(gestureMap.get(data["gestureId"]) != undefined) {
			if(data["event"] == "execute_gesture") {
				var params = data["params"];
				gestureMap.get(data["gestureId"]).execute(params);
			}
			else if(data["event"] == "abort_gesture") {
				gestureMap.get(data["gestureId"]).abort();
			}
		}
		else {
			console.log("Gesture Id not found! " + data["gestureId"]);
		}
	},

	onGestureDone: function(gestureId, instanceId, error) {
		var msg = {
			"event" : "execute_done",
			"gestureId" : gestureId,
			"instanceId" : instanceId,
			"error" : error
		};

		topicClient.publish("gesture-manager", msg, false);
	},

	shutdown: function() {
		topicClient.unsubscribe("gesture-manager");
	},

	onReconnect: function() {
		for(var i = 0; i++ < gestureMap.size; gestureMap.next()) {
			var sensor = gestureMap.value();
			var override = gestureOverrideMap.get(gesture.gestureId);
			var msg = {
				"event" : "add_gesture_proxy",
				"gestureId" : gesture.gestureId,
				"instanceId" : gesture.instanceId,
				"override" : override
			};

			topicClient.publish("gesture-manager", msg, false);
		}
	},

	start: function() {
		topicClient.subscribe("gesture-manager", this.onEvent);
	}
}

var GestureManager = (function () {
	var instance;

	function createInstance() {
		var object = new GestureManagerInstance();
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