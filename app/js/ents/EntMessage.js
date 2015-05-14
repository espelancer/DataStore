'use strict';

var EntMessage = Ent.create(
  	'EntMessage',
 	{
    	_data: {'Body' : ''},
  	}
);

var ent1 = EntMessage.genNullableFromID(123);
console.log(ent1.getBody(), ent1.getEntType(), ent1.getID());
ent1.setBody('test');
console.log(ent1.getBody());