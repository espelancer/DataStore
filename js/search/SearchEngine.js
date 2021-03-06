'use strict';

var SearchEngine = {

	_searchIndexDB: new PouchDB('searchIndexDB'),
	
	save: function(ent, searchFields) {
		return new Promise(function (fulfill, reject) {
			var newObject = {
				_id: ent.getID(),
				entType: ent.getEntType(),
			};
			var genMap = {};
			for (var key in searchFields) {
				if (!searchFields.hasOwnProperty(key)) {
					continue;
				}
				if (typeof(ent['get' + searchFields[key]]) === 'function') {
					newObject[searchFields[key]] = ent['get' + searchFields[key]]();
				} else if (typeof(ent['gen' + searchFields[key]]) === 'function') {
					genMap[searchFields[key]] = ent['gen' + searchFields[key]];
				} else {
					reject('index ' + searchFields[key] + ' doesn\'t exist');
					return;
				}
			}
			
			if (!$.isEmptyObject(genMap)) {
				GSPromiseExtension.genm(genMap).then(function(res) {
					for (var searchIndex in res) {
						if (!res.hasOwnedProperty(searchIndex)) {
							continue;
						}
						newObject[searchIndex] = res[searchIndex];
					}
					
					SearchEngine._searchIndexDB.get(ent.getID()).then(function (doc) {
						newObject._rev = doc._rev;
						if (_.isEqual(newObject, doc)) {
							fulfill(doc._id);
							return;
						}
			
		  				return SearchEngine._searchIndexDB.put(newObject)
		  				.then(function (doc) {
  							fulfill(doc.id);
	  					});
					}).catch(function (err) {
						if (err.name !== 'not_found') {
							reject('save fail');
							return;
						}
						// Local save a new Ent with ID
	  					return SearchEngine._searchIndexDB.put(newObject)
	  					.then(function (doc) {
  							fulfill(doc.id);
	  					});
					});
				});
			} else {
				SearchEngine._searchIndexDB.get(ent.getID()).then(function (doc) {
					newObject._rev = doc._rev;
					if (_.isEqual(newObject, doc)) {
						fulfill(doc._id);
						return;
					}
			
	  				return SearchEngine._searchIndexDB.put(newObject)
	  				.then(function (doc) {
  						fulfill(doc.id);
	  				});
				}).catch(function (err) {
					if (err.name !== 'not_found') {
						reject('save fail');
						return;
					}
					// Local save a new Ent with ID
	  				return SearchEngine._searchIndexDB.put(newObject).then(function (doc) {
  						fulfill(doc.id);
	  				});
				});
			}
		});
	},
	
	search: function(query, fields, entType) {
		return new Promise(function (fulfill, reject) {
			SearchEngine._searchIndexDB.search({
			    query: query,
   				fields: fields,
   				limit: 10,
				filter: function (doc) {
					return doc.entType === entType;
				}
			}).then(function (res) {
				var ids = [];
  				for (var key in res.rows) {
  					if (!res.rows.hasOwnProperty(key)) {
  						continue;
  					}
  					ids.push(res.rows[key].id);
  				}
  				fulfill(ids);
			});
		});
	},
	
	buildIndex: function(fields, entType) {
		var docIndex = '_design/' + entType;
		return new Promise(function (fulfill, reject) {
			SearchEngine._searchIndexDB.get(docIndex).then(function (doc) {
				fulfill(true);
			}).catch(function(err) {
				if (err.name !== 'not_found') {
					reject('save fail');
					return;
				}
				
				var views = {};
				for (var key in fields) {
  					if (!fields.hasOwnProperty(key)) {
  						continue;
  					}
  			
  					(function() {
  						var index = fields[key];
  						var type = entType;
  						views['by' + index] = {
  							map: '(function (doc) {\
  								if (doc.entType === "' + type + '") {\
  									emit(doc.' + index + ');\
  								}\
  							})'
  						};
  					}());
  				}
	
				var indexDoc = {
  					_id: docIndex,
  					views: views,
				};
				SearchEngine._searchIndexDB.put(indexDoc).then(function (doc) {
					fulfill(true);
				}).catch(function(err) {
					reject(err);
				});
			});
		});
	},
	
	searchIndex: function(query, index, entType) {
		return new Promise(function (fulfill, reject) {
			SearchEngine._searchIndexDB.query('' + entType + '/by' + index, {
				startkey: '' + query, 
				endkey: '' + query + '\uffff', 
				limit: 10
			}).then(function (res) {
				var ids = [];
  				for (var key in res.rows) {
  					if (!res.rows.hasOwnProperty(key)) {
  						continue;
  					}
  					ids.push(res.rows[key].id);
  				}
  				fulfill(ids);
			});
		});
	},
};