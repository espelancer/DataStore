'use strict';

Ent.create(
  	'EntMessage',
 	{
    	_data: {'Body' : ''},
    	_cachedFunction: {'getAssocs': true},
    	_searchFields: ['Body', 'Title'],
    	getTitle: function() {
    		return 'title ' + this.getBody();
    	},
    	getAssocs: function() {
    		return new Promise(function (fulfill, reject) {
    			Assoc.getAll(this.getID(), 'm2m').then(function(ents) {
					fulfill(ents);
				}).catch(function(err) {
					reject(err);
				});
			}.bind(this));
    	},
  	}
);
/*
EntMessage.genEnforceFromID('123').then(function(ent) {
	return ent.save();
});

EntMessage.genEnforceFromID('1234').then(function(ent) {
	return ent.save();
});
*//*
EntMessage.genEnforceFromData({}).then(function(ent) {
	return ent.save();
});
/*
EntMessage.genEnforceFromID('123').then(function(ent) {
	return ent.getAssocs('234','235');
}).then(function(ents) {
	console.log(ents);
	EntMessage.genEnforceFromID('1234').then(function(ent) {
		return ent.getAssocs('234','235');
	}).then(function(ents) {
		console.log(ents);
	});
});*/

EntMessage.searchBody('test body').then(function(ents) {
	console.log(ents);
});