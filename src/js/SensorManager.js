function SensorManagerInstance() {
	console.log("SensorManager has been instantiated!!");
}

SensorManagerInstance.prototype = {
	constructor: SensorManagerInstance,

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