function ThingCategory() {
	INVALID : -1,
	PERCEPTION : 0,
	AGENCY : 1,
	MODEL : 2
}

function ThingEventType() {
	NONE : 0,
	ADDED : 1,
	REMOVED : 2,
	STATE : 4,
	IMPORTANCE : 8
}

function S4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

function GUID() {
	var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
	return guid;
}

function Thing() {
	thingType : "IThing",
	category : ThingCategory.PERCEPTION,
	guid : new GUID(),
	importance : 1.0,
	state : "ADDED", 
	create_time : new Date().getTime() / 1000,
	life_span : 3600.0,
	body : {},
	data_type : "",
	data : {},
	parentId : "",

	"getThingType" : function() {
		return this.thingType;
	},
	"getCategory" : function() {
		return this.category;
	},
	"getGUID" : function() {
		return this.guid;
	},
	"getImportance" : function() {
		return this.importance;
	},
	"getState" : function() {
		return this.state;
	},
	"getCreateTime" : function() {
		return this.create_time;
	},
	"getLifeSpan" : function() {
		return this.life_span;
	},
	"getBody" : function() {
		return this.body;
	},
	"getDataType" : function() {
		return this.data_type;
	},
	"getData" : function() {
		return this.data;
	},
	"getParentId" : function() {
		return this.parentId;
	}
}