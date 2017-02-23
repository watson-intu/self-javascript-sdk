function SensorManagerInstance() {
	console.log("SensorManager has been instantiated!!");
}

SensorManagerInstance.prototype = {
	constructor: SensorManagerInstance,

	addSensor: function(sensor, override) {
		sensorMap.put(sensor, override);
	},

	getSensors: function() {
		for(var i = 0; i++ < sensorMap.size; sensorMap.next()) {
			console.log(sensorMap.key() + ": " + sensorMap.value());
		}
	},

	getTest: function() {
		console.log("getTest hit!");
	},

	getTest2: function() {
		console.log("getTest2 hit!");
	},

	start: function() {
		TopicClient.getInstance().subscribe("sensor-manager", getTest);
	}
}

var SensorManager = (function () {
	var instance;

	function createInstance() {
		var object = new SensorManagerInstance();
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