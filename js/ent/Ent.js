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
				if (!Ent._entClassMap[doc.entType]) {
					fulfill(null);
					return;
				}
				
				window[doc.entType].genNullableFromData(doc.ent, id).then(function(ent) {
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
		
		var cachedFN = entData._cachedFunction;
		var searchFields = entData._searchFields;
		delete entData._cachedFunction;
		delete entData._searchFields
		
		if (typeof(cachedFN) !== 'object') {
			cachedFN = {};
		}
		if (typeof(searchFields) !== 'object') {
			searchFields = [];
		}
		
  		var entClass = function(id) {
  			this._fnCache = {};
			for (var key in entData) {
				if (entData.hasOwnProperty(key)) {
					if (typeof(entData[key]) === 'function' && cachedFN[key]) {
						(function() {
							var fn_key = key;
							this[fn_key] = function() {
								var pass_args = arguments;
								return new Promise(function (fulfill, reject) {
									entData[fn_key].apply(this, pass_args)
									.then(function(res) {
										var cache_key = 
											'' + fn_key + '(' + [].join.call(pass_args);
										if (typeof(this._fnCache[cache_key]) 
											!== 'undefined') {
											fulfill(res);
											return;
										}
										this._fnCache[cache_key] = res;
										fulfill(res);
									}.bind(this)).catch(function(err) {
										reject(err);
									});
								}.bind(this));
							}.bind(this);
						}.bind(this)());
					} else {
						this[key] = entData[key];
					}
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
  								
  								if (!$.isEmptyObject(searchFields)) {
  									SearchEngine.save(this, searchFields);
  								}
  								fulfill(saved_id);
  							}.bind(this)).catch(function(err) {
  								reject(err);
  							});
  						} else {
  							entLoader.save(id, entType, this._data)
  							.then(function(saved_id) {
  								if (!$.isEmptyObject(searchFields)) {
  									SearchEngine.save(this, searchFields);
  								}
  								fulfill(saved_id);
	  						}.bind(this)).catch(function(err) {
  								reject(err);
  							});;
  						}
  					}.bind(this));
  				};
  			}
  		};
  		Ent._entClassMap[entType] = entClass;
  		
  		var entStaticClass = {
  	
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
  			},
  			
  			search: function(query) {
  				return new Promise(function (fulfill, reject) {
  					if ($.isEmptyObject(searchFields)) {
  						fulfill([]);
  						return;
  					}
  					SearchEngine.search(query, searchFields, entType)
  					.then(function(res) {
						if (typeof(res) !== 'object') {
							res = [];
						}
						GSPromiseExtension.genv(res.map(this.genNullableFromID, this))
						.then(function(ents) {
							fulfill(ents);
						});
					}.bind(this));
  				}.bind(this));
  			}
  		};
  		
  		if (!$.isEmptyObject(searchFields)) {
  			SearchEngine.buildIndex(searchFields, entType).catch(function() {});
  		}
  		for (var keySearch in searchFields) {
  			if (!searchFields.hasOwnProperty(keySearch)) {
  				continue;
  			}
  			(function() {
  				var index = searchFields[keySearch];
  				entStaticClass['search' + index] = function(query) {
  					return new Promise(function (fulfill, reject) {
	  					SearchEngine.searchIndex(query, index, entType)
  						.then(function(res) {
							if (typeof(res) !== 'object') {
								res = [];
							}
							GSPromiseExtension.genv(res.map(this.genNullableFromID, this))
							.then(function(ents) {
								fulfill(ents);
							});
						}.bind(this));
  					}.bind(this));
  				}.bind(this);
  			}.bind(this)());
  		}
  		
    	window[entType] = entStaticClass;
  	},
};
