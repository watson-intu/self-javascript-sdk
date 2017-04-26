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

function FeatureExtractorInstance() {
	console.log("FeatureExtractor has been instantiated!!");
}

FeatureExtractorInstance.prototype = {
	constructor: FeatureExtractorInstance,

	isRegistered : function(extractor) {
		for(var i = 0; i++ < extractorMap.size; extractorMap.next()) {
			var a = extractorMap.value();
			if(extractor.extractorId == a.extractorId) {
				return true;
			}
		}

		return false;
	},

	addExtractor : function(extractor, override) {
		if(extractorMap.get(extractor.extractorId) == undefined) {
			extractorMap.put(extractor.extractorId, extractor);
			extractorOverrideMap.put(extractor.extractorId, override);
			var msg = {
				"event" : "add_extractor_proxy",
				"extractorId" : extractor.extractorId,
				"name" : extractor.extractorName,
				"override" : override
			};
			topicClient.publish("feature-manager", msg, false);
			console.log("Adding extractor to Feature Extractor: " + extractor.extractorId);
		}
	},

	removeExtractor : function(extractor) {
		if(extractorMap.get(extractor.extractorId) != undefined) {
			extractorMap.remove(extractor.extractorId);
			var msg = {
				"event" : "remove_extractor_proxy",
				"extractorId" : extractor.extractorId
			};
			topicClient.publish("feature-manager", msg, false);
		}
	},

	onEvent : function(msg) {
		var payload = JSON.stringify(msg);
		var data = JSON.parse(msg["data"]);
		if(extractorMap.get(data["extractorId"]) != undefined) {
			if(data["event"] == "start_extractor") {
				extractorMap.get(data["extractorId"]).onStart();
			}
			else if(data["event"] == "stop_extractor") {
				extractorMap.get(data["extractorId"]).onStop();
			}
			else {
				console.log("Could not interpet event for FeatureManager: " + data["event"]);
			}
		}
		else {
			console.log("extractor Id not found! " + data["extractorId"]);
		}
	},

	shutdown : function() {
		topicClient.unsubscribe("feature-manager");
	},

	onDisconnect : function() {
		for(var i = 0; i++ < extractorMap.size; extractorMap.next()) {
			var extractor = extractorMap.value();
			extractor.onStop();
		}
	},

	onReconnect : function() {
		for(var i = 0; i++ < extractorMap.size; extractorMap.next()) {
			var extractor = extractor.value();
			var override = extractorOverrideMap.get(extractor.extractorId);
			var msg = {
				"event" : "add_extractor_proxy",
				"extractorId" : extractor.extractorId,
				"name" : extractor.extractorName,
				"override" : override
			};
			topicClient.publish("feature-manager", msg, false);
		}
	},

	start: function() {
		topicClient.subscribe("feature-manager", this.onEvent);
	}
}

var FeatureExtractor = (function () {
	var instance;

	function createInstance() {
		var object = new FeatureExtractorInstance();
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