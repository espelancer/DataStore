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
  		var ents = {};
  		var fetching_list = {};
  		var callback = null;
  		for (var key in ids) {
    		if (!ids.hasOwnProperty(key) || !ids[key]) {
      			continue;
    		}
    
    		var id = ids[key];
    		if (typeof(id) !== 'string') {
    			ents[id] = null;
    			continue;
    		}
    			
    		if (typeof(Ent._entCache[id]) !== 'undefined') {
 				ents[id] = Ent._entCache[id];
 				continue;
			}
			fetching_list[id] = true;
			
			(function() {
				var ent_id = id;
				Ent.genNewNullableFromID(ent_id).then(function(ent) {
				 	Ent._entCache[ent_id] = ent;
			 		ents[ent_id] = ent;
			 	
					delete fetching_list[ent_id];
				 	if ($.isEmptyObject(fetching_list) && callback) {
						callback(ents);
		 			}
				});
			}());
		}

 		return {
 			then: function(fn) {
 				if ($.isEmptyObject(fetching_list)) {
 					fn(ents);
 				} else {
 					callback = fn;
 				}
 			}
 		};
  	},
  	
	genNullableFromID: function(id) {
		if (!id || typeof(id) !== 'string') {
			return {
 				then: function(fn) {
 					fn(null);
 				}
 			};
 		}
		 		
		if (typeof(Ent._entCache[id]) !== 'undefined') {
 			return {
 				then: function(fn) {
 					fn(Ent._entCache[id]);
 				}
 			};
		}
		 		
		var callback = null;
 		var res;
		Ent.genNewNullableFromID(id).then(function(ent) {
		 	Ent._entCache[id] = ent;
			if (callback) {
		 		callback(ent);
		 	} else {
				res = ent;
			}
		});
		 		
 		return {
 			then: function(fn) {
 				if (typeof(res) !== 'undefined') {
 					fn(res);
 				} else {
 					callback = fn;
 				}
 			}
 		};
 	},
		 	
	genEnforceFromID: function(id) {
		if (!id || typeof(id) !== 'string') {
			throw 'id is required';
		}
		 		
		var callback = null;
		var res;
		this.genNullableFromID(id).then(function(ent) {
		 	if (ent === null) {
				throw 'Invalid Ent';
			}
		 	if (callback) {
				callback(ent);
		 	} else {
				res = ent;
		 	}
		});
		 		
 		return {
 			then: function(fn) {
 				if (typeof(res) !== 'undefined') {
 					fn(res);
 				} else {
 					callback = fn;
 				}
 			}
 		};
	},
		 	
  	genNewNullableFromID: function(id) {
		var callback = null;
		var res;
		EntLoader.load(id).then(function(doc) {
			var entType = doc.entType;
			if (!Ent._entClassMap[entType]) {
				if (callback) {
					callback(null);
				} else {
					res = null;
				}
				return;
			}
			delete doc.entType;
			window[entType].genNullableFromData(doc, id).then(function(ent) {
				if (callback) {
					callback(ent);
				} else {
					res = ent;
				}
			});
		}.bind(this));
		 		
 		return {
 			then: function(fn) {
 				if (typeof(res) !== 'undefined') {
 					fn(res);
 				} else {
 					callback = fn;
 				}
 			}
 		};
 	},
		 	
	genNewEnforceFromID: function(id) {
		if (!id || typeof(id) !== 'string') {
			throw 'id is required';
		}
		 		
		var callback = null;
		var res;
		Ent.genNewNullableFromID(id).then(function(ent) {
			if (ent === null) {
		 		throw 'Invalid Ent';
		 	}
			if (callback) {
		 		callback(ent);
			} else {
		 		res = ent;
			}
		});
		 		
 		return {
 			then: function(fn) {
 				if (typeof(res) !== 'undefined') {
 					fn(res);
				} else {
 					callback = fn;
 				}
 			}
 		};
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
		 			var callback = null;
		 			var res;
  					if (EntLoader.isTempEnt(id)) {
  						entLoader.save(null, entType, this._data)
  						.then(function(saved_id) {
  							this.getID = function() { return saved_id; };
  							this.isTempEnt = function() { return false; };
  							Ent._entCache[saved_id] = this;
  							if (callback) {
  								callback(saved_id);
  							} else {
  								res = saved_id;
  							}
  						}.bind(this));
  					} else {
  						entLoader.save(id, entType, this._data).then(function(saved_id) {
  							if (callback) {
  								callback(saved_id);
  							} else {
  								res = saved_id;
  							}
  						});
  					}
  					
  					return {
 						then: function(fn) {
 							if (typeof(res) !== 'undefined') {
 								fn(res);
 							} else {
 								callback = fn;
 							}
 						}
 					};
  				};
  			}
  		};
  		Ent._entClassMap[entType] = entClass;
  		
  		var entStaticClass = {
  		
		  	genFromIDs: function(ids) {
  				var ents = {};
  				var fetching_list = {};
  				var callback = null;
  				for (var key in ids) {
    				if (!ids.hasOwnProperty(key) || !ids[key]) {
      					continue;
    				}
    
   			 		var id = ids[key];
    				if (typeof(id) !== 'string') {
    					ents[id] = null;
    					continue;
    				}
    			
    				if (typeof(Ent._entCache[id]) !== 'undefined') {
    					if (Ent._entCache[id].getEntType() === entType) {
 							ents[id] = Ent._entCache[id];
 						} else {
 							ents[id] = null;
 						}
 						continue;
					}
					fetching_list[id] = true;
			
					((function() {
						var ent_id = id;
						this.genNewNullableFromID(ent_id).then(function(ent) {
				 			Ent._entCache[ent_id] = ent;
			 				ents[ent_id] = ent;
			 	
							delete fetching_list[ent_id];
						 	if ($.isEmptyObject(fetching_list) && callback) {
								callback(ents);
		 					}
						});
					}.bind(this))());
				}
	
 				return {
 					then: function(fn) {
 						if ($.isEmptyObject(fetching_list)) {
 							fn(ents);
 						} else {
 							callback = fn;
 						}
 					}
 				};
 		 	},
  	
		 	genNullableFromID: function(id) {
		 		if (!id || typeof(id) !== 'string') {
		 			return {
 						then: function(fn) {
 							fn(null);
 						}
 					};
		 		}
		 		
		 		if (typeof(Ent._entCache[id]) !== 'undefined') {
		 			if (Ent._entCache[id].getEntType() === entType) {
	 					return {
 							then: function(fn) {
 								fn(Ent._entCache[id]);
 							}
 						};
 					} else {
			 			return {
 							then: function(fn) {
 								fn(null);
 							}
 						};
 					}
		 		}
		 		
		 		var callback = null;
		 		var res;
		 		this.genNewNullableFromID(id).then(function(ent) {
		 			Ent._entCache[id] = ent;
		 			if (callback) {
		 				callback(ent);
		 			} else {
		 				res = ent;
		 			}
		 		});
		 		
 				return {
 					then: function(fn) {
 						if (typeof(res) !== 'undefined') {
 							fn(res);
 						} else {
 							callback = fn;
 						}
 					}
 				};
		 	},
		 	
		 	genEnforceFromID: function(id) {
		 		if (!id || typeof(id) !== 'string') {
		 			throw 'id is required';
		 		}
		 		
		 		var callback = null;
		 		var res;
		 		this.genNullableFromID(id).then(function(ent) {
		 			if (ent === null) {
		 				throw 'Invalid Ent';
		 			}
		 			if (callback) {
		 				callback(ent);
		 			} else {
		 				res = ent;
		 			}
		 		});
		 		
 				return {
 					then: function(fn) {
 						if (typeof(res) !== 'undefined') {
 							fn(res);
 						} else {
 							callback = fn;
 						}
 					}
 				};
		 	},
		 	
		 	genNewNullableFromID: function(id) {
				if (!Ent._entClassMap[entType]) {
					return {
 						then: function(fn) {
 							fn(null);
 						}
 					};
				}
		 		
		 		var callback = null;
		 		var res;
				entLoader.loadGivenType(id, entType).then(function(data) {
					this.genNullableFromData(data, id).then(function(ent) {
						if (callback) {
							callback(ent);
						} else {
							res = ent;
						}
					});
				}.bind(this));
		 		
 				return {
 					then: function(fn) {
 						if (typeof(res) !== 'undefined') {
 							fn(res);
 						} else {
 							callback = fn;
 						}
 					}
 				};
 			},
		 	
		 	genNewEnforceFromID: function(id) {
		 		if (!id || typeof(id) !== 'string') {
		 			throw 'id is required';
		 		}
		 		
		 		var callback = null;
		 		var res;
		 		this.genNewNullableFromID(id).then(function(ent) {
		 			if (ent === null) {
		 				throw 'Invalid Ent';
		 			}
		 			if (callback) {
		 				callback(ent);
		 			} else {
		 				res = ent;
		 			}
		 		});
		 		
 				return {
 					then: function(fn) {
 						if (typeof(res) !== 'undefined') {
 							fn(res);
 						} else {
 							callback = fn;
 						}
 					}
 				};
		 	},
      
  			genNullableFromData: function(data, id) {
				if (!Ent._entClassMap[entType] || data === null) {
 			 		return {
 						then: function(fn) {
 							fn(null);
 						}
 					};
				}
				if (!id) {
				  id = 'tmp#' + Ent._tmpID;
				  Ent._tmpID++;
				}
 				var ent = new Ent._entClassMap[entType](id);
 				ent._data = data;
 				if (!ent.canSee()) {
 			 		return {
 						then: function(fn) {
 							fn(null);
 						}
 					};
 				}
 				
 				return {
 					then: function(fn) {
 						fn(ent);
 					}
 				};
  			},
      
  			genEnforceFromData: function(data) {
				if (!Ent._entClassMap[entType]) {
					throw 'entType doen\'t exist';
				}
				
				var callback = null;
				var res;
		 		this.genNullableFromData(data).then(function(ent) {
		 			if (ent === null) {
		 				throw 'Invalid Ent';
		 			}
		 			if (callback) {
		 				callback(ent);
		 			} else {
		 				res = ent;
		 			}
		 		});
 				return {
 					then: function(fn) {
 						if (typeof(res) !== 'undefined') {
 							fn(res);
 						} else {
 							callback = fn;
 						}
 					}
 				};
  			}
  		};
    	return entStaticClass;
  	},
};
