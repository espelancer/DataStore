'use strict';

var EntMessage = Ent.create(
  	'EntMessage',
 	{
    	_data: {'Body' : ''},
  	}
);

GSPromiseExtend.genm(
	{'123' : Ent.genEnforceFromID('123'), '1234': Ent.genEnforceFromID('1234')}
).then(function(ents) {
	console.log(ents);
}).catch(function(err) {
	console.log('err', err);
});