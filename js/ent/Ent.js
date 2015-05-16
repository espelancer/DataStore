'use strict';

var Ent = {
	_entClassMap: {},
	_entCache: {},
	_tmpID: 0,
  	
  	_validLoader: function(loader) {
  		if (typeof(loader.load) !== 'function' ||
  			typeof(loader.loadGivenType) !== 'function' ||
  			typeof(loader.save) !== 'function') {
  			throw 'Invalid loader';
  		}
  	},
  	
  	genFromIDs: function(ids) {
  		return (function () {
			var accumulator = {};
			var ready = Promise.resolve(null);

			ids.forEach(function (id) {
				ready = ready.then(function () {
					return Ent.genNullableFromID(id);
				}).then(function (value) {
					accumulator[id] = value;
				});
			});

			return ready.then(function () { return accumulator; });
		}());
  	},
  	
	genNullableFromID: function(id) {
		return new Promise(function (fulfill, reject) {
			if (!id || typeof(id) !== 'string') {
				fulfill(null);
				return;
	 		}
		 		
			if (typeof(Ent._entCache[id]) !== 'undefined') {
 				fulfill(Ent._entCache[id]);
 				return;
			}
		 		
			Ent.genNewNullableFromID(id).then(function(ent) {
			 	Ent._entCache[id] = ent;
			 	fulfill(ent);
			});
		});
 	},
		 	
	genEnforceFromID: function(id) {
		return new Promise(function (fulfill, reject) {
			if (!id || typeof(id) !== 'string') {
				reject('id is required');
			}
		 		
			this.genNullableFromID(id).then(function(ent) {
			 	if (ent === null) {
					reject('Invalid Ent');
				}
				fulfill(ent);
			});
 		}.bind(this));
	},
		 	
  	genNewNullableFromID: function(id) {
		return new Promise(function (fulfill, reject) {
			EntLoader.load(id).then(function(doc) {
				var entType = doc.entType;
				if (!Ent._entClassMap[entType]) {
					fulfill(null);
					return;
				}
				
				delete doc.entType;
				window[entType].genNullableFromData(doc, id).then(function(ent) {
					fulfill(ent);
				});
			}).catch(function(err) {
				fulfill(null);
			});;
		});
 	},
		 	
	genNewEnforceFromID: function(id) {
		return new Promise(function (fulfill, reject) {
			if (!id || typeof(id) !== 'string') {
				reject('id is required');
				return;
			}
			
			Ent.genNewNullableFromID(id).then(function(ent) {
				if (ent === null) {
			 		reject('Invalid Ent');
			 		return;
			 	}
		 		fulfill(ent);
			});
		});
	},
      
  	create: function(entType, entData, entLoader) {
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
  			this.isTempEnt = function() { return EntLoader.isTempEnt(id); };
  			
  			if (typeof(this.canSee) !== 'function') {
  				this.canSee = function() { return true; };
  			}
  			if (typeof(this.save) !== 'function') {
  				this.save = function() {
  					return new Promise(function (fulfill, reject) {
	  					if (EntLoader.isTempEnt(id)) {
  							entLoader.save(null, entType, this._data)
  							.then(function(saved_id) {
  								this.getID = function() { return saved_id; };
  								this.isTempEnt = function() { return false; };
  								Ent._entCache[saved_id] = this;
  								fulfill(saved_id);
  							}.bind(this)).catch(function(err) {
  								reject(err);
  							});
  						} else {
  							entLoader.save(id, entType, this._data)
  							.then(function(saved_id) {
  								fulfill(saved_id);
	  						}).catch(function(err) {
  								reject(err);
  							});;
  						}
  					}.bind(this));
  				};
  			}
  		};
  		Ent._entClassMap[entType] = entClass;
  		
  		var entStaticClass = {
  		
		  	genFromIDs: function(ids) {
		  		return ((function () {
					var accumulator = {};
					var ready = Promise.resolve(null);

					ids.forEach(function (id) {
						ready = ready.then(function () {
							return this.genNullableFromID(id);
						}.bind(this)).then(function (value) {
							accumulator[id] = value;
						});
					}.bind(this));

					return ready.then(function () { return accumulator; });
				}.bind(this))());
 		 	},
  	
		 	genNullableFromID: function(id) {
		 		return new Promise(function (fulfill, reject) {
		 			if (!id || typeof(id) !== 'string') {
		 				fulfill(null);
		 				return;
			 		}
		 		
			 		if (typeof(Ent._entCache[id]) !== 'undefined') {
			 			if (Ent._entCache[id].getEntType() === entType) {
			 				fulfill(Ent._entCache[id]);
	 					} else {
	 						fulfill(null);
 						}
 						return;
 					}
		 		
		 			this.genNewNullableFromID(id).then(function(ent) {
		 				Ent._entCache[id] = ent;
		 				fulfill(ent);
			 		});
 				}.bind(this));
		 	},
		 	
		 	genEnforceFromID: function(id) {
		 		return new Promise(function (fulfill, reject) {
		 			if (!id || typeof(id) !== 'string') {
		 				reject('id is required');
		 				return;
		 			}
		 		
		 			this.genNullableFromID(id).then(function(ent) {
		 				if (ent === null) {
		 					reject('Invalid Ent');
		 					return;
		 				}
		 				fulfill(ent);
			 		});
 				}.bind(this));
		 	},
		 	
		 	genNewNullableFromID: function(id) {
		 		return new Promise(function (fulfill, reject) {
					if (!Ent._entClassMap[entType]) {
						fulfill(null);
						return;
					}
		 		
					entLoader.loadGivenType(id, entType).then(function(data) {
						this.genNullableFromData(data, id).then(function(ent) {
							fulfill(ent);
						});
					}.bind(this)).catch(function(err) {
						fulfill(null);
					});
 				}.bind(this));
 			},
		 	
		 	genNewEnforceFromID: function(id) {
		 		return new Promise(function (fulfill, reject) {
		 			if (!id || typeof(id) !== 'string') {
		 				reject('id is required');
		 				return;
		 			}
		 		
			 		this.genNewNullableFromID(id).then(function(ent) {
			 			if (ent === null) {
			 				reject('Invalid Ent');
			 				return;
		 				}
		 				fulfill(ent);
			 		});
		 		}.bind(this));
		 	},
      
  			genNullableFromData: function(data, id) {
  				return new Promise(function (fulfill, reject) {
					if (!Ent._entClassMap[entType] || data === null) {
						fulfill(null);
						return;
					}
					if (!id) {
					  id = 'tmp#' + Ent._tmpID;
					  Ent._tmpID++;
					}
 					var ent = new Ent._entClassMap[entType](id);
 					ent._data = data;
 					if (!ent.canSee()) {
 						fulfill(null);
 						return;
 					}
 					fulfill(ent);
 				});
  			},
      
  			genEnforceFromData: function(data) {
  				return new Promise(function (fulfill, reject) {
					if (!Ent._entClassMap[entType]) {
						reject('entType doen\'t exist');
						return;
					}
				
		 			this.genNullableFromData(data).then(function(ent) {
		 				if (ent === null) {
		 					reject('Invalid Ent');
		 					return;
			 			}
			 			fulfill(ent);
		 			});
 				}.bind(this));
  			}
  		};
    	return entStaticClass;
  	},
};
