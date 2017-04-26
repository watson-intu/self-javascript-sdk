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

function MicrophoneSensor() {
	console.log("microphone sensor instantiated!");

}

var micPaused = true;

/**
*  This is an example of how to implement your own Microphone sensor.
*  A sensor should interface hardware and produce IData objects
*/
MicrophoneSensor.prototype = {
	sensorId: GUID(),
	sensorName: "Microphone",
	dataType: "AudioData",
	binaryType: "audio/L16;rate=16000;channels=1",

	/**
	*  Function that will get called to start the sensor
	*/
	onStart: function() {
		console.log("Microphone Sensor has started!");
		console.log(this, "Microphone object");
		var micSensor = this;
		var streamAudio = function(stream) {
	    	var context = new AudioContext();
	    	var input = context.createMediaStreamSource(stream)
	    	var processor = context.createScriptProcessor(1024,1,1);

	    	processor.connect(context.destination);

	    	processor.onaudioprocess = function(e){
	      		if(!micPaused) {
	      			console.log(e.inputBuffer.getChannelData(0)[0]);
	      			sensorManager.sendData(micSensor, e.inputBuffer);
	      		}
	    	};
  		};

  		navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      		.then(streamAudio);
		return true;
	},

	/**
	*  Function that will be called to stop the sensor
	*/
	onStop: function() {
		return true;
	},

	/**
	*  Pause the sensor
	*/
	onPause: function() {
		console.log("Pausing microphone!");
		micPaused = true;
		return true;
	},

	/*
	*  Resume the sensor
	*/
	onResume: function() {
		console.log("Resuming microphone");
		micPaused = false;
		return true;
	},
}