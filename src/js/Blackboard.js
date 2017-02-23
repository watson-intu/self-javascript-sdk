function Subscriber(callback, thing_event, path) {
	callback : callback,
	thing_event : thing_event,
	path : path
};

function BlackboardInstance() {
	console.log("Blackboard has been instantiated!!");
}

BlackboardInstance.prototype = {
	constructor: BlackboardInstance,

	onEvent: function(data) {
		console.log("Blackboard received data: " + data);
	},

	subscribeToType: function(thing, thing_event, path, callback) {
		var p = blackboardMap.get(path);
		if(p == undefined) {
			TopicClient.getInstance().subscribe(path + "blackboard", onEvent);
			blackboardMap.put(path, new Map);
		}

		var t = blackboardMap.get(path).get(thing);
		if(t == undefined) {
			var msg = {
				"event" : "subscribe_to_type",
				"type" : thing,
				"event_mask" : thing_event
			};
			TopicClient.getInstance().publish(path + "blackboard", msg, false);
			var list = [];
			blackboardMap.get(path).put(thing, list);
		}

		blackboardMap.get(path).get(thing).push(new Subscriber(callback, thing_event, path));
	},

	unsubcribeToType: function(thing, callback, path) {
		var p = blackboardMap.get(path);
		if(p != undefined) {
			var t = blackboardMap.get(path).get(thing);
			if(t != undefined) {
				for(var i = 0; i++ < blackboardMap.get(path).size; blackboardMap.get(path).next()) {
					var list = blackboardMap.get(path).value();
					for(var j = 0; j < list.length; j++) {
						if(list[j].callback == callback) {
							list.splice(j, 1);
							break;
						}
					}
					if(list.length == 0) {
						blackboardMap.get(path).remove(thing);
					}
				}

				if(blackboardMap.get(path).get(thing) == undefined) {
					var msg = {
						"event" : "unsubscribe_from_type",
						"type" : thing
					};

					TopicClient.getInstance().publish(path + "blackboard", msg, false);
				}
			}
		}
	}

}


var Blackboard = (function () {
	var instance;

	function createInstance() {
		var object = new BlackboardInstance();
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