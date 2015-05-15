'use strict';

var EntMessage = Ent.create(
  	'EntMessage',
 	{
    	_data: {'Body' : ''},
  	}
);
/*
EntLoader._entDB.get('1431664819476').then(function (doc) {
  return EntLoader._entDB.remove(doc);
});
EntLoader._entDB.get('1431664862075').then(function (doc) {
  return EntLoader._entDB.remove(doc);
});
EntLoader._entDB.get('1431664875225').then(function (doc) {
  return EntLoader._entDB.remove(doc);
});

EntMessage.genEnforceFromData({'Body':'123'}).then(function(ent1) {
	ent1.getID = function() { return '1234'; };
	console.log(ent1);
//	ent1.save().then(function(id) {console.log(ent1.getID());});
});*/