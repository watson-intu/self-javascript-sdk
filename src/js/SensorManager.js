function SensorManagerInstance() {
	console.log("SensorManager has been instantiated!!");
}

SensorManagerInstance.prototype = {
	constructor: SensorManagerInstance,

	addSensor: function(sensor, override) {
		var msg = {
			"event" : "add_sensor_proxy",
			"sensorId" : sensor.sensorId,
			"name" : sensor.sensorName,
			"data_type" : sensor.dataType,
			"binary_type" : sensor.binaryType,
			"override" : override
		};
		TopicClient.getInstance().publish("sensor-manager", msg, false);
		sensorMap.put(sensor.sensorId, sensor);
		sensorOverrideMap.put(sensor.sensorId, override);
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