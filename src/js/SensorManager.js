/**
* Copyright 2017 IBM Corp. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*/

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
		topicClient.publish("sensor-manager", msg, false);
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
			topicClient.publish("sensor-proxy-" + sensor.sensorId, data, false);
		}
		for(var i = 0; i++ < extractorMap.size; extractorMap.next()) {
			var extractor = extractorMap.value();
			if(sensor.dataType = extractor.dataType) {
				extractor.callback(data);
			}
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
			topicClient.publish("sensor-manager", msg, false);
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

	registerForSensor: function(extractorId, callback) {
		if(extractorMap.get(extractorId) != undefined) {
			if(this.findSensor(extractorMap.get(extractorId).dataType) != undefined) {
				extractorMap.get(extractorId).callback = callback;
				console.log("Got callback for extractor!");
			}
		}
		else {
			console.log("Could not get callback!!");
		}

	},

	unregisterForSensor: function(extractorId) {
		if(extractorMap.get(extractorId) != undefined) {
			extractorMap.remove(extractorId);
		}
	},

	getSensors: function() {
		for(var i = 0; i++ < sensorMap.size; sensorMap.next()) {
			console.log(sensorMap.key() + ": " + sensorMap.value());
		}
	},

	onEvent: function(msg) {
		var payload = JSON.stringify(msg);
		var data = JSON.parse(msg["data"]);
		if(sensorMap.get(data["sensorId"]) != undefined) {
			if(data["event"] == "start_sensor") {
				sensorMap.get(data["sensorId"]).onStart();
			}
			else if(data["event"] == "stop_sensor") {
				sensorMap.get(data["sensorId"]).onStop();
			}
			else {
				console.log("Could not interpet event for SensorManager: " + data["event"]);
			}
		}
		else {
			console.log("Sensor Id not found! " + data["sensorId"]);
		}
	},

	shutdown: function() {
		topicClient.unsubscribe("sensor-manager");
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

			topicClient.publish("sensor-manager", msg, false);
		}
	},

	start: function() {
		topicClient.subscribe("sensor-manager", this.onEvent);
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
