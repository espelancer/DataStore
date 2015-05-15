'use strict';

var EntLoader = {

	_entDB: new PouchDB('entDB'),

	load: function(id, entType) {
		var callback = null;
		var res;
		EntLoader._entDB.get(id).then(function (doc) {
			var data = doc;
			if (data.entType !== entType) {
				if (callback) {
					callback(null);
				} else {
					res = null;
				}
				return;
			}
			delete data._rev;
			delete data._id;
			delete data.entType;
			if (callback) {
				callback(data);
			} else {
				res = data;
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