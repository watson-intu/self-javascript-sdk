var Subscriber = function(callback, thing_event, path) {
	this.callback = callback;
	this.thing_event = thing_event;
	this.path = path;
}

function BlackboardInstance() {
}

BlackboardInstance.prototype = {
	constructor: BlackboardInstance,

	onEvent: function(msg) {
		var payload = JSON.stringify(msg);
		var data = JSON.parse(msg["data"]);
		var thing = new Thing();
		var thingEvent = new ThingEvent();
		thingEvent.setThingEvent(ThingEventType.NONE);
		thingEvent.setEventType(data);
		if(data["event"] == "add_object") {
			thingEvent.setEventType(ThingEventType.ADDED);
			thingEvent.setThing(data["thing"]);
			thing.deserialize(data["thing"]);
			if(data.hasOwnProperty("parent")) {
				thing.setParentId(data["parent"]);
			}
			thingEvent.setThing(thing);
			thingMap.put(thing.getGUID(), thing);
		}
		else if(data["event"] == "remove_object") {
			thingEvent.setEventType(ThingEventType.REMOVED);
			if(thingMap.get(data["thing_guid"]) != undefined) {
				thingMap.remove(data["thing_guid"]);
			}
		}
		else if(data["event"] == "set_object_state") {
			if(thingMap.get(data["thing_guid"]) != undefined) {
				thingMap.get(data["thing_guid"]).setState(data["state"]);
			}
		}
		else if(data["event"] == "set_object_importance") {
			if(thingMap.get(data["thing_guid"]) != undefined) {
				thingMap.get(data["thing_guid"]).setImportance(data["importance"]);
			}
		}

		if(thingEvent.getEventType() != ThingEventType.NONE) {
			for(var i = 0; i++ < blackboardMap.size; blackboardMap.next()) {
				for(var j = 0; j++ < blackboardMap.value().size; blackboardMap.value().next()) {
					if(data["type"] == blackboardMap.value().key()) {
						for (var i = 0; i < blackboardMap.value().value().length; i++) {
							if(thingEvent.getEventType() == blackboardMap.value().value()[i].thing_event) {
								blackboardMap.value().value()[i].callback(data);
							}
						}
					}
				}
			}
		}
	},

	subscribeToType: function(thing, thing_event, path, callback) {
		var p = blackboardMap.get(path);
		if(p == undefined) {
			topicClient.subscribe(path + "blackboard", this.onEvent);
			blackboardMap.put(path, new Map);
		}

		var t = blackboardMap.get(path).get(thing);
		if(t == undefined) {
			var msg = {
				"event" : "subscribe_to_type",
				"type" : thing,
				"event_mask" : thing_event
			};
			topicClient.publish(path + "blackboard", msg, false);
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

					topicClient.publish(path + "blackboard", msg, false);
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

	// 	topicClient.publish(path + "blackboard", msg, false);
	// },

	removeThing: function(thing, path) {
		var msg = {
			"event" : "remove_object",
			"thing_guid" : thing.guid
		};
		topicClient.publish(path + "blackboard", msg, false);
	},

	setState: function(thing, state, path) {
		var msg = {
			"event" : "set_object_state",
			"thing_guid" : thing.guid,
			"state" : state
		};
		topicClient.publish(path + "blackboard", msg, false);
	},

	setImportance: function(thing, importance, path) {
		var msg = {
			"event" : "set_object_importance",
			"thing_guid" : thing.guid,
			"importance" : importance
		};
		topicClient.publish(path + "blackboard", msg, false);
	}

}


var Blackboard = (function () {
	var instance;

	function createInstance() {
		var object = new BlackboardInstance();
		console.log("Instantiating Blackboard!");
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