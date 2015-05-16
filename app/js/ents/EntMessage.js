'use strict';

var EntMessage = Ent.create(
  	'EntMessage',
 	{
    	_data: {'Body' : ''},
    	_cachedFunction: {'getAssocs': true},
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

EntMessage.genEnforceFromID('123').then(function(ent) {
	return ent.getAssocs('234','235');
}).then(function(ents) {
	console.log(ents);
	EntMessage.genEnforceFromID('1234').then(function(ent) {
		return ent.getAssocs('234','235');
	}).then(function(ents) {
		console.log(ents);
	});
});

/*
GSPromiseExtension.genm(
	{'123' : Ent.genEnforceFromID('123'), '1234': EntMessage.genEnforceFromID('1234')}
).then(function(ents) {
	console.log(ents);
}).catch(function(err) {
	console.log('err', err);
});

Assoc.getAll('123', 'm2m', {'limit':1, 'start':1431759584655}).then(function(ents) {
	console.log(ents);
}).catch(function(err) {
	console.log('err', err);
});*/