var ExampleAgent = function(agentName, agentId) {
	this.agentName = agentName;
	this.agentId = agentId;
}

ExampleAgent.prototype = {
	constructor: ExampleAgent,

	onText : function(payload) {
		console.log("ExampleAgent OnText: " + payload["thing"]["m_Text"]);
	},

	onStart : function() {
		console.log("ExampleAgent OnStart Called!");
		Blackboard.getInstance().subscribeToType("Text", ThingEventType.ADDED, "", this.onText);
		return true;
	},

	onStop : function() {
		console.log("ExampleAgent OnStop Called!");
		return true;
	}
}