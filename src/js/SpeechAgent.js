var SpeechAgent = function(agentName, agentId) {
	this.agentName = agentName;
	this.agentId = agentId;
}

SpeechAgent.prototype = {
	constructor: SpeechAgent,

	onText : function(payload) {
		var text = payload["m_Text"];
		var formattedText = text.replace(/ *\[[^\]]*]/, '');
		var data = {'output': {'text': formattedText}};
		Api.setWatsonPayload(data);
	},

	onStart : function() {
		console.log("SpeechAgent OnStart Called!");
		Blackboard.getInstance().subscribeToType("Say", ThingEventType.ADDED, "", this.onText);
//		topicClient.subscribe("conversation", this.onText);
		return true;
	},

	onStop : function() {
		console.log("SpeechAgent OnStop Called!");
		return true;
	}
}