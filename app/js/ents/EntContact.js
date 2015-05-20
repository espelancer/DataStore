'use strict';

Ent.createInterface('IEntContact', {});

Ent.create(
  	'EntEmailContact',
 	{
 		_interfaces: {
 			IEntContact: true,
 		},
    	_data: {
    		Email: '',
    		UserID: null,
    	},
    	_searchFields: ['Email'],
  	}
);