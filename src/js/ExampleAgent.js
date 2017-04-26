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

var ExampleAgent = function(agentName, agentId) {
	this.agentName = agentName;
	this.agentId = agentId;
}

ExampleAgent.prototype = {
	constructor: ExampleAgent,

	onText : function(payload) {
		var text = payload["m_Text"];
		if(text[0] == '"' && text[text.length - 1] == '"') {
			text = text.substring(1, text.length-1);
		}
		var data = {'input': {'text': text}};
		Api.setUserPayload(data);
//		addChatText("John", text);

	},

	onStart : function() {
		console.log("ExampleAgent OnStart Called!");
		Blackboard.getInstance().subscribeToType("Text", ThingEventType.ADDED, "", this.onText);
		return true;
	},

	onStop : function() {
		console.log("ExampleAgent OnStop Called!");
		return true;
	}
}