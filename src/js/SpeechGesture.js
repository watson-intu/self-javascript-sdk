var SpeechGesture = function(gestureId, instanceId) {
	this.gestureId = gestureId;
	this.instanceId = instanceId;
}

SpeechGesture.prototype = {
	constructor: SpeechGesture,

	onStart : function() {
		console.log("SpeechGesture OnStart Called!");
		return true;
	},

	onStop : function() {
		console.log("SpeechGesture OnStop Called!");
		return true;
	},

	execute : function(params) {
		var text = params["text"];
		var language = params["language"];
		var gender = params["gender"];

		addChatText("Watson", text);
		gestureManager.onGestureDone(this.gestureId, this.instanceId);
		return true;
	},

	abort : function() {
		return true;
	}
}