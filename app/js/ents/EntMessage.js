'use strict';

var EntMessage = Ent.create(
  	'EntMessage',
 	{
    	_data: {'Body' : ''},
  	}
);
/*
EntMessage.genEnforceFromData({'Body' : '123 test'}).then(function(ent) {
	console.log(ent);
	//ent.setBody('test data');
	ent.save().then(function(id) {
		console.log(id);
	});
}).catch(function(err) {
	console.log('err', err);
});*/