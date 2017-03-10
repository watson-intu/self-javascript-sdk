function MicrophoneSensor() {
	console.log("microphone sensor instantiated!");
}

MicrophoneSensor.prototype = {
	sensorId: GUID(),
	sensorName: "Microphone",
	dataType: "AudioData",
	binaryType: "audio/L16;rate=16000;channels=1",
	onStart: function() {
		console.log("Microphone Sensor has started!");
		return true;
	},

	onStop: function() {
		return true;
	},

	onPause: function() {
		return true;
	},

	onResume: function() {
		return true;
	},

	sendData: function(value) {
//		topicClient.publish("conversation", value, false);
	}
}