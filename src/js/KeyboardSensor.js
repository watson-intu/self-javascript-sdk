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

function KeyboardSensor() {
	console.log("keyboard sensor instantiated!");
}

KeyboardSensor.prototype = {
	sensorId: "asdf",
	sensorName: "keyboard",
	dataType: "TextData",
	binaryType: "KeyboardData",
	onStart: function() {
		console.log("Keyboard Sensor has started!");
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
		topicClient.publish("conversation", value, false);
	}
}