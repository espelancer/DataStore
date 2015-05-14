'use strict';

var Ent = {
	_entClassMap : {},
	_entCache : {},
	_tmpID : 0,
  	
  	_validLoader : function(loader) {
  		if (typeof(loader.load) !== 'function' ||
  			typeof(loader.save) !== 'function') {
  			throw 'Invalid loader';
  		}
  	},
      
  	create : function(entType, entData, entLoader) {
		if (!entType) {
			throw 'entType is required';
		}
		
		if (typeof(entLoader) !== 'object') {
			entLoader = EntLoader;
		} else {
			Ent._validLoader(entLoader);
		}
		
  		var entClass = function(id) {
			for (var key in entData) {
				if (entData.hasOwnProperty(key)) {
					this[key] = entData[key];
				}
			}
			
			if (typeof(this._data) !== 'object') {
				this._data = {};
			}
			for (var key in this._data) {
				if (this._data.hasOwnProperty(key)) {
					this['get' + key] = function() { return this._data[key]; };
					this['set' + key] = function(value) { 
						return this._data[key] = value; 
					};
				}
			}
			
  			this.getEntType = function() { return entType; };
  			this.getID = function() { return id; };
  			
  			if (typeof(this.isValid) !== 'function') {
  				this.isValid = function() { return true; };
  			}
  			if (typeof(this.save) !== 'function') {
  				this.save = function() {
  					entLoader.save(id, entType, this._data);
  				};
  			}
  		};
  		Ent._entClassMap[entType] = entClass;
  		
  		var entStaticClass = {
  		
		 	genNullableFromID : function(id) {
		 		if (!id) {
		 			return null;
		 		}
		 		if (typeof(Ent._entCache[id]) !== 'undefined') {
		 			return Ent._entCache[id];
		 		}
		 		return this.genNewNullableFromID(id);
		 	},
		 	
		 	genEnforceFromID : function(id) {
		 		if (!id) {
		 			throw 'id is required';
		 		}
		 		var ent = this.genNullableFromID(id);
		 		if (typeof(ent) !== 'object') {
		 			throw 'Invalid Ent';
		 		}
		 		return ent;
		 	},
		 	
		 	genNewNullableFromID : function(id) {
				if (!Ent._entClassMap[entType]) {
					return null;
				}
				var data = entLoader.load(id, entType);
 				return this.genNullableFromData(data, id);
 			},
		 	
		 	genNewEnforceFromID : function(id) {
		 		if (!id) {
		 			throw 'id is required';
		 		}
		 		var ent = this.genNewNullableFromID(id);
		 		if (typeof(ent) !== 'object') {
		 			throw 'Invalid Ent';
		 		}
		 		return ent;
		 	},
      
  			genNullableFromData : function(data, id) {
				if (!Ent._entClassMap[entType]) {
					return null;
				}
				if (!id) {
				  id = 'temp#' + Ent._tmpID;
				  Ent._tmpID++;
				}
 				var ent = new Ent._entClassMap[entType](id);
 				ent._data = data;
 				if (!ent.isValid()) {
 					return null;
 				}
 				return ent;
  			},
      
  			genEnforceFromData : function(data) {
				if (!Ent._entClassMap[entType]) {
					throw 'entType doen\'t exist';
				}
		 		var ent = this.genNullableFromData(data);
		 		if (typeof(ent) !== 'object') {
		 			throw 'Invalid Ent';
		 		}
 				return ent;
  			}
  		};
    	return entStaticClass;
  	},
};
