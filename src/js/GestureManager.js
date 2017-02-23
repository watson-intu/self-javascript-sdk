function GestureManagerInstance() {
	console.log("GestureManager has been instantiated!!");
}

GestureManagerInstance.prototype = {
	constructor: GestureManagerInstance,

	addGesture: function(gesture, override) {
		var msg = {
			"event" : "add_gesture_proxy",
			"gestureId" : gesture.gestureId,
			"instanceId" : gesture.instanceId,
			"override" : override
		};
		TopicClient.getInstance().publish("gesture-manager", msg, false);
		gestureMap.put(gesture.gestureId, gesture);
		gestureOverrideMap.put(gesture.gestureId, override);
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
			TopicClient.getInstance().publish("gesture-manager", msg, false);
		}
	},

	onEvent: function(msg) {
		console.log("onEvent hit in GestureManager!");
		console.log(msg);
	},

	onGestureDone: function(gesture, error) {
		var msg = {
			"event" : "execute_done",
			"gestureId" : gesture.gestureId,
			"instanceId" : gesture.instanceId,
			"error" : error
		};

		TopicClient.getInstance().publish("gesture-manager", msg, false);
	},

	shutdown: function() {
		TopicClient.getInstance().unsubscribe("gesture-manager");
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

			TopicClient.getInstance().publish("gesture-manager", msg, false);
		}
	},

	start: function() {
		TopicClient.getInstance().subscribe("gesture-manager", onEvent);
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