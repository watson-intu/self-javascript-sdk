var ExampleExtractor = function(extractorName, extractorId) {
	this.extractorName = extractorName;
	this.extractorId = extractorId;
}

ExampleExtractor.prototype = {
	constructor: ExampleExtractor,
	dataType: "AudioData",
	callback: undefined,

	onAudioData : function(payload) {
		console.log("Received Received Audio Data! ");
	},

	onStart : function() {
		console.log("ExampleExtractor OnStart Called!");
		SensorManager.getInstance().registerForSensor(this.extractorId, this.onAudioData);
		return true;
	},

	onStop : function() {
		console.log("ExampleExtractor OnStop Called!");
		SensorManager.getInstance().unregisterForSensor("AudioData");
		return true;
	}
}