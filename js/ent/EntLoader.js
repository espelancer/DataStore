'use strict';

var EntLoader = {

	_entDB: new PouchDB('entDB'),
	
	isTempEnt: function(id) {
		return (id.indexOf('tmp#') !== -1);
	},
	
	loadGivenType: function(id, entType) {
		var callback = null;
		var res;
		EntLoader.load(id).then(function(doc) {
			if (doc.entType !== entType) {
				if (callback) {
					callback(null);
				} else {
					res = null;
				}
				return;
			}
			delete doc.entType;
			if (callback) {
				callback(doc);
			} else {
				res = doc;
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

	load: function(id) {
		var callback = null;
		var res;
		EntLoader._entDB.get(id).then(function (doc) {
			delete doc._rev;
			delete doc._id;
			if (callback) {
				callback(doc);
			} else {
				res = doc;
			}
		}).catch(function (err) {
			if (callback) {
				callback(null);
			} else {
				res = null;
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
	
	save: function(id, entType, data, callback) {
		var callback = null;
		var res;
		var newObject = jQuery.extend({}, data);
		newObject.entType = entType;
		if (!id) {
			newObject._id = '' + (new Date().getTime());
			EntLoader._entDB.put(newObject).then(function (doc) {
  				if (callback) {
  					callback(doc.id);
  				} else {
  					res = doc.id;
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
		
		newObject._id = id;
		EntLoader._entDB.get(id).then(function (doc) {
			newObject._rev = doc._rev;
			if (_.isEqual(newObject, doc)) {
				if (callback) {
  					callback(doc.id);
  				} else {
  					res = doc.id;
  				}
  				return {
  					catch: function(fn) {}
  				}
			}
			
  			return EntLoader._entDB.put(newObject).then(function (doc) {
  				if (callback) {
  					callback(doc.id);
  				} else {
  					res = doc.id;
  				}
  			});
		}).catch(function (err) {
			if (err.name !== 'not_found') {
				throw 'save fail';
			}
			// Local save a new Ent with ID
  			return EntLoader._entDB.put(newObject).then(function (doc) {
  				if (callback) {
  					callback(doc.id);
  				} else {
  					res = doc.id;
  				}
  			});
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
};