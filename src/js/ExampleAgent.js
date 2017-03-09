var ExampleAgent = function(agentName, agentId) {
	this.agentName = agentName;
	this.agentId = agentId;
}

ExampleAgent.prototype = {
	constructor: ExampleAgent,

	onText : function(payload) {
		var text = payload["thing"]["m_Text"];
		if(text[0] == '"' && text[text.length - 1] == '"') {
			text = text.substring(1, text.length-1);
		}
		var data = {'input': {'text': text}};
		Api.setUserPayload(data);
//		addChatText("John", text);

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