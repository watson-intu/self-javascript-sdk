function AgentSocietyInstance() {
	console.log("AgentSociety has been instantiated!!");
}

AgentSocietyInstance.prototype = {
	constructor: AgentSocietyInstance,

	isRegistered : function(agent) {
		for(var i = 0; i++ < agentMap.size; agentMap.next()) {
			var a = agentMap.value();
			if(agent.agentId == a.agentId) {
				return true;
			}
		}

		return false;
	},

	addAgent : function(agent, override) {
		if(agentMap.get(agent.agentId) == undefined) {
			agentMap.put(agent.agentId, agent);
			agentOverrideMap.put(agent.agentId, override);
			var msg = {
				"event" : "add_agent_proxy",
				"agentId" : agent.agentId,
				"name" : agent.agentName,
				"override" : override
			};
			topicClient.publish("agent-society", msg, false);
			console.log("Adding Agent to Agent Society: " + agent.agentId);
		}
	},

	removeAgent : function(agent) {
		if(agentMap.get(agent.agentId) != undefined) {
			agentMap.remove(agent.agentId);
			var msg = {
				"event" : "remove_agent_proxy",
				"agentId" : agent.agentId
			};
			topicClient.publish("agent-society", msg, false);
		}
	},

	onEvent : function(msg) {
		var payload = JSON.stringify(msg);
		var data = JSON.parse(msg["data"]);
		if(agentMap.get(data["agentId"]) != undefined) {
			if(data["event"] == "start_agent") {
				agentMap.get(data["agentId"]).onStart();
			}
			else if(data["event"] == "stop_agent") {
				agentMap.get(data["agentId"]).onStop();
			}
			else {
				console.log("Could not interpet event for AgentSociety: " + data["event"]);
			}
		}
		else {
			console.log("Agent Id not found! " + data["agentId"]);
		}
	},

	shutdown : function() {
		topicClient.unsubscribe("agent-society");
	},

	onDisconnect : function() {
		for(var i = 0; i++ < agentMap.size; agentMap.next()) {
			var agent = agentMap.value();
			agent.onStop();
		}
	},

	onReconnect : function() {
		for(var i = 0; i++ < agentMap.size; agentMap.next()) {
			var agent = agent.value();
			var override = agentOverrideMap.get(agent.agentId);
			var msg = {
				"event" : "add_agent_proxy",
				"agentId" : agent.agentId,
				"name" : agent.agentName,
				"override" : override
			};
			topicClient.publish("agent-society", msg, false);
		}
	},

	start: function() {
		topicClient.subscribe("agent-society", this.onEvent);
	}
}

var AgentSociety = (function () {
	var instance;

	function createInstance() {
		var object = new AgentSocietyInstance();
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