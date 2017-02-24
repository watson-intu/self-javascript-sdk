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
			TopicClient.getInstance().publish("agent-society", msg, false);
		}
	},

	removeAgent : function(agent) {
		if(agentMap.get(agent.agentId) != undefined) {
			agentMap.remove(agent.agentId);
			var msg = {
				"event" : "remove_agent_proxy",
				"agentId" : agent.agentId
			};
			TopicClient.getInstance().publish("agent-society", msg, false);
		}
	},

	onEvent : function(msg) {
		console.log("AgentSociety onEvent: " + msg);
	},

	shutdown : function() {
		TopicClient.getInstance().unsubscribe("agent-society");
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
			TopicClient.getInstance().publish("agent-society", msg, false);
		}
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