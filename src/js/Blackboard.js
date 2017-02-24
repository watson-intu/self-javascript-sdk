var Subscriber = function(callback, thing_event, path) {
	this.callback = callback;
	this.thing_event = thing_event;
	this.path = path;
}

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
			TopicClient.getInstance().subscribe(path + "blackboard", this.onEvent);
			console.log("Blackboard subscribing to path for first time: " + path); 
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
			console.log("Blackboard published following message: " + JSON.stringify(msg));
			var list = [];
			blackboardMap.get(path).put(thing, list);
		}

		blackboardMap.get(path).get(thing).push(new Subscriber(callback, thing_event, path));
		console.log("Blackboard subscribeToType: " + thing);
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
	},

	// addThing: function(thing, path) {
	// 	var msg = {
	// 		"event" : "add_object",
	// 		"type" : thing.thingType,
	// 		"thing" : thing.serialize(),
	// 		if(thing.parentId != "") {
	// 			"parent" : thing.parentId;
	// 		}
	// 	};

	// 	TopicClient.getInstance().publish(path + "blackboard", msg, false);
	// },

	removeThing: function(thing, path) {
		var msg = {
			"event" : "remove_object",
			"thing_guid" : thing.guid
		};
		TopicClient.getInstance().publish(path + "blackboard", msg, false);
	},

	setState: function(thing, state, path) {
		var msg = {
			"event" : "set_object_state",
			"thing_guid" : thing.guid,
			"state" : state
		};
		TopicClient.getInstance().publish(path + "blackboard", msg, false);
	},

	setImportance: function(thing, importance, path) {
		var msg = {
			"event" : "set_object_importance",
			"thing_guid" : thing.guid,
			"importance" : importance
		};
		TopicClient.getInstance().publish(path + "blackboard", msg, false);
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