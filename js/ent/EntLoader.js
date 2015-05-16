'use strict';

var EntLoader = {

	_entDB: new PouchDB('entDB'),
	
	isTempEnt: function(id) {
		return (id.indexOf('tmp#') !== -1);
	},
	
	loadGivenType: function(id, entType) {
		return new Promise(function (fulfill, reject) {
			EntLoader.load(id).then(function(doc) {
				if (doc.entType !== entType) {
					reject('Invalid EntType');
				} else {
					fulfill(doc.ent);
				}
			}).catch(function(err) {
				reject(err);
			});
		});
	},

	load: function(id) {
		return new Promise(function (fulfill, reject) {
			EntLoader._entDB.get(id).then(function (doc) {
				var type = doc.entType;
				delete doc._rev;
				delete doc._id;
				delete doc.entType;
				fulfill({'ent': doc, 'entType': type});
			}).catch(function (err) {
				reject(err);
			});
    	});
	},
	
	save: function(id, entType, data) {
		return new Promise(function (fulfill, reject) {
			var newObject = jQuery.extend({}, data);
			newObject.entType = entType;
			if (!id) {
				newObject._id = '' + (new Date().getTime());
				EntLoader._entDB.put(newObject).then(function (doc) {
  					fulfill(doc.id);
	  			});
	  			return;
			}
		
			newObject._id = id;
			EntLoader._entDB.get(id).then(function (doc) {
				newObject._rev = doc._rev;
				if (_.isEqual(newObject, doc)) {
					fulfill(doc._id);
					return;
				}
			
  				return EntLoader._entDB.put(newObject).then(function (doc) {
  					fulfill(doc.id);
	  			});
			}).catch(function (err) {
				if (err.name !== 'not_found') {
					reject('save fail');
					return;
				}
				// Local save a new Ent with ID
  				return EntLoader._entDB.put(newObject).then(function (doc) {
  					fulfill(doc.id);
	  			});
			});
		});
	},
};