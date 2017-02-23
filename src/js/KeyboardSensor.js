function KeyboardSensor() {
	console.log("keyboard sensor instantiated!");
}

KeyboardSensor.prototype = {
	sensorId: "asdf",
	sensorName: "keyboard",
	dataType: "TextData",
	binaryType: "KeyboardData",
	onStart: function() {
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
	}
}