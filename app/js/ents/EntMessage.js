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
*/
/*
Ent.genFromIDs(['123', '1234']).then(function(ents) {
	console.log(ents);
	//ent1.save().then(function(id) {console.log(ent1.getID());});
});*/

EntMessage.genFromIDs(['123', '1234']).then(function(ents) {
	console.log(ents);
	//ent1.save().then(function(id) {console.log(ent1.getID());});
});