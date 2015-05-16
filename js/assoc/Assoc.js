'use strict';

var Assoc = {

	_assocDB: new PouchDB('assocDB'),
	
	_assocIndex: {
  		_id: '_design/assocIndex',
  		views: {
    		byKey: {
      			map: function (doc) { emit(doc.keyIndex); }.toString()
    		}
  		}
	},

	enforceSet: function(id1, id2, type, key, data) {
		return new Promise(function (fulfill, reject) {
			Assoc.set(id1, id2, type, key, data).then(function(res) {
				if (!res) {
					reject('Assoc set fail');
				} else {
					fulfill(true);
				}
			});
		});
	},
	
	set: function(id1, id2, type, key, data) {
		return new Promise(function (fulfill, reject) {
			if (!id1 || !id2 || !type) {
				fulfill(false);
				return;
			}
			if (!key) {
				key = '' + (new Date().getTime());
			}
		
			var index = '' + type + '#' + id1 + '#' + id2;
			var assoc_obj = {
				'_id': index,
				'keyIndex': '' + type + '#' + id1 + '#' + key,
				'id1': id1,
				'id2': id2,
				'type': type,
				'key': key,
				'data': data,
			};
		
			Assoc._assocDB.get(index).then(function (doc) {
				assoc_obj._rev = doc._rev;
				if (_.isEqual(assoc_obj, doc)) {
					fulfill(true);
					return;
				}
			
  				return Assoc._assocDB.put(assoc_obj).then(function (doc) {
  					fulfill(true);
	  			});
			}).catch(function (err) {
				if (err.name !== 'not_found') {
					fulfill(false);
					return;
				}
				// Local save a new Ent with ID
  				return Assoc._assocDB.put(assoc_obj).then(function (doc) {
  					fulfill(true);
	  			});
			});
		});
	},
	
	enforceDelete: function(id1, id2, type) {
		return new Promise(function (fulfill, reject) {
			Assoc.delete(id1, id2, type).then(function(res) {
				if (!res) {
					reject('Assoc delete fail');
				} else {
					fulfill(true);
				}
			});
		});
	},
	
	delete: function(id1, id2, type) {
		return new Promise(function (fulfill, reject) {
			if (!id1 || !id2 || !type) {
				fulfill(false);
				return;
			}
		
			var index = '' + type + '#' + id1 + '#' + id2;
			Assoc._assocDB.get(index).then(function (doc) {
  				return Assoc._assocDB.remove(doc).then(function (doc) {
  					fulfill(true);
	  			}).catch(function (err) {
	  				fulfill(false);
	  			});
			}).catch(function (err) {
				if (err.name !== 'not_found') {
					fulfill(false);
					return;
				}
				fulfill(true);
			});
		});
	},
	
	enforceGet: function(id1, id2, type) {
		return new Promise(function (fulfill, reject) {
			Assoc.get(id1, id2, type).then(function(doc) {
				if ($.isEmptyObject(doc)) {
					reject('Assoc get fail');
				} else {
					fulfill(doc);
				}
			});
		});
	},
	
	get: function(id1, id2, type) {
		return new Promise(function (fulfill, reject) {
			if (!id1 || !id2 || !type) {
				fulfill({});
				return;
			}
		
			var index = '' + type + '#' + id1 + '#' + id2;
			Assoc._assocDB.get(index).then(function (doc) {
				delete doc._id;
				delete doc._rev;
				delete doc.key_index;
  				fulfill(doc);
			}).catch(function (err) {
				fulfill({});
			});
		});
	},
	
	getAll: function(id1, type, pageInfo) {
		return new Promise(function (fulfill, reject) {
			var limit = 50;
			if (pageInfo && pageInfo.limit) {
				limit = pageInfo.limit;
			}
			var start = '' + type + '#' + id1 + '#';
			if (pageInfo && pageInfo.start) {
				start = start + pageInfo.start + '\u0000';
			}
			Assoc._assocDB.query('assocIndex/byKey', {
  				startkey: start, 
  				endkey: '' + type + '#' + id1 + '#\uffff', 
  				limit: limit,
  				include_docs: true
			}).then(function (res) {
				var rows = [];
				for (var key in res.rows) {
					if (!res.rows.hasOwnProperty(key)) {
						continue;
					}
					var obj = res.rows[key].doc;
					rows.push({
						'id1': obj.id1,
						'id2': obj.id2,
						'type': obj.type,
						'key': obj.key,
					});
				}
				fulfill(rows);
			}).catch(function (err) {
				reject(err);
			});
		});
	},
};/*
Assoc._assocDB.allDocs({
  				startkey: 'm2m#123#', 
  				endkey: 'm2m#123#\uffff', 
  				include_docs: true
			}).then(function (res) {
				console.log(res);
			});

Assoc._assocDB.query('assocIndex/byKey', {stale: 'update_after'}).then(function(res) {
	console.log(res);
});*/
// save index
/*
Assoc._assocDB.put(Assoc._assocIndex).then(function(res) {
	Assoc._assocDB.query('assocIndex/byKey', {stale: 'update_after'});
});*/