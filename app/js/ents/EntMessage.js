'use strict';

var EntMessage = Ent.create(
  	'EntMessage',
 	{
    	_data: {'Body' : ''},
  	}
);
/*
GSPromiseExtension.genm(
	{'123' : Ent.genEnforceFromID('123'), '1234': EntMessage.genEnforceFromID('1234')}
).then(function(ents) {
	console.log(ents);
}).catch(function(err) {
	console.log('err', err);
});
*/
Assoc.getAll('123', 'm2m', {'limit':1, 'start':1431759584655}).then(function(ents) {
	console.log(ents);
}).catch(function(err) {
	console.log('err', err);
});