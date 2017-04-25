function ClassifierManagerInstance() {
	console.log("ClassifierManager has been instantiated!!");
}

ClassifierManagerInstance.prototype = {
	constructor: ClassifierManagerInstance,

	isRegistered : function(classifier) {
		for(var i = 0; i++ < classifierMap.size; classifierMap.next()) {
			var a = classifierMap.value();
			if(classifier.classifierId == a.classifierId) {
				return true;
			}
		}

		return false;
	},

	addClassifier : function(classifier, override) {
		if(classifierMap.get(classifier.classifierId) == undefined) {
			classifierMap.put(classifier.classifierId, classifier);
			classifierOverrideMap.put(classifier.classifierId, override);
			var msg = {
				"event" : "add_classifier_proxy",
				"classifierId" : classifier.classifierId,
				"name" : classifier.classifierName,
				"override" : override
			};
			topicClient.publish("classifier-manager", msg, false);
			console.log("Adding Classifier to Classifier Manager: " + classifier.classifierId);
		}
	},

	removeClassifier : function(classifier) {
		if(classifierMap.get(classifier.classifierId) != undefined) {
			classifierMap.remove(classifier.classifierId);
			var msg = {
				"event" : "remove_classifier_proxy",
				"classifierId" : classifier.classifierId
			};
			topicClient.publish("classifier-manager", msg, false);
		}
	},

	onEvent : function(msg) {
		var payload = JSON.stringify(msg);
		var data = JSON.parse(msg["data"]);
		if(classifierMap.get(data["classifierId"]) != undefined) {
			if(data["event"] == "start_classifier") {
				classifierMap.get(data["classifierId"]).onStart();
			}
			else if(data["event"] == "stop_classifier") {
				classifierMap.get(data["classifierId"]).onStop();
			}
			else {
				console.log("Could not interpet event for ClassifierManager: " + data["event"]);
			}
		}
		else {
			console.log("Classifier Id not found! " + data["classifierId"]);
		}
	},

	shutdown : function() {
		topicClient.unsubscribe("classifier-manager");
	},

	onDisconnect : function() {
		for(var i = 0; i++ < classifierMap.size; classifierMap.next()) {
			var classifier = classifierMap.value();
			classifier.onStop();
		}
	},

	onReconnect : function() {
		for(var i = 0; i++ < classifierMap.size; classifierMap.next()) {
			var classifier = classifier.value();
			var override = classifierOverrideMap.get(classifier.classifierId);
			var msg = {
				"event" : "add_classifier_proxy",
				"classifierId" : classifier.classifierId,
				"name" : classifier.classifierName,
				"override" : override
			};
			topicClient.publish("classifier-manager", msg, false);
		}
	},

	start: function() {
		topicClient.subscribe("classifier-manager", this.onEvent);
	}
}

var ClassifierManager = (function () {
	var instance;

	function createInstance() {
		var object = new ClassifierManagerInstance();
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