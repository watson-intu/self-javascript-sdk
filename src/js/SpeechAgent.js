var SpeechAgent = function(agentName, agentId) {
	this.agentName = agentName;
	this.agentId = agentId;
	this.user = true;
}

SpeechAgent.prototype = {
	constructor: SpeechAgent,

	onText : function(payload) {
		console.log(payload);
		if(this.user == false)
		{
			var text = payload["data"];
			console.log(text);
			var data = {'output': {'text': text}};
			Api.setWatsonPayload(data);
			this.user = true;
		}
		else
			this.user = false;

	},

	onStart : function() {
		console.log("SpeechAgent OnStart Called!");
//		Blackboard.getInstance().subscribeToType("Say", ThingEventType.ADDED, "", this.onText);
		topicClient.subscribe("conversation", this.onText);
		return true;
	},

	onStop : function() {
		console.log("SpeechAgent OnStop Called!");
		return true;
	}
}