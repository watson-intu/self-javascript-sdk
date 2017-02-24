function SensorManagerInstance() {
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

	isRegistered: function(sensor) {
		var found = sensorMap.get(sensor.sensorId);
		if(found == undefined) {
			return false;
		}
		return true
	},

	sendData: function(sensor, data) {
		if(isRegistered(sensor)) {
			TopicClient.getInstance().publish("sensor-proxy-" + sensor.sensorId, data, false);
		}
	},

	removeSensor: function(sensor) {
		if(sensorMap.get(sensor.sensorId) != undefined) {
			sensorMap.remove(sensor.sensorId);
			sensorOverrideMap.remove(sensor.sensorId);
			var msg = {
				"event" : "remove_sensor_proxy",
				"sensorId" : sensor.sensorId
			};
			TopicClient.getInstance().publish("sensor-manager", msg, false);
		}
	},

	findSensor: function(dataType) {
		for(var i = 0; i++ < sensorMap.size; sensorMap.next()) {
			var sensor = sensorMap.value();
			if(sensor.dataType == dataType) {
				return sensor;
			}
		}

		return undefined;
	},

	getSensors: function() {
		for(var i = 0; i++ < sensorMap.size; sensorMap.next()) {
			console.log(sensorMap.key() + ": " + sensorMap.value());
		}
	},

	onEvent: function(msg) {
		console.log("onEvent hit in SensorManager!");
		console.log(msg);
	},

	shutdown: function() {
		TopicClient.getInstance().unsubscribe("sensor-manager");
	},

	onDisconnect : function() {
		for(var i = 0; i++ < sensorMap.size; sensorMap.next()) {
			var sensor = sensorMap.value();
			sensor.onStop();
		}
	},

	onReconnect: function() {
		for(var i = 0; i++ < sensorMap.size; sensorMap.next()) {
			var sensor = sensorMap.value();
			var override = sensorOverrideMap.get(sensor.sensorId);
			var msg = {
				"event" : "add_sensor_proxy",
				"sensorId" : sensor.sensorId,
				"name" : sensor.sensorName,
				"data_type" : sensor.dataType,
				"binary_type" : sensor.binaryType,
				"override" : override
			};

			TopicClient.getInstance().publish("sensor-manager", msg, false);
		}
	},

	start: function() {
		TopicClient.getInstance().subscribe("sensor-manager", onEvent);
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
