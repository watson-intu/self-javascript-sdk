var ExampleClassifier = function(classifierName, classifierId) {
	this.classifierName = classifierName;
	this.classifierId = classifierId;
}

ExampleClassifier.prototype = {
	constructor: ExampleClassifier,

	onText : function(payload) {
		var text = payload["m_Text"];
		console.log("Received Text: " + text);

	},

	onStart : function() {
		console.log("ExampleClassifier OnStart Called!");
		Blackboard.getInstance().subscribeToType("Text", ThingEventType.ADDED, "", this.onText);
		return true;
	},

	onStop : function() {
		console.log("ExampleClassifier OnStop Called!");
		Blackboard.getInstance().unsubscribeToType("Text")
		return true;
	}
}