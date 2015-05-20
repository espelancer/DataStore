'use strict';

Ent.createInterface('IEntMessage', {});

Ent.create(
  	'EntEmailMessage',
 	{
 		_interfaces: {
 			IEntMessage: true,
 		},
    	_data: {
    		Body: '',
    		SenderContactID: null,
    		ParentThreadID: null,
    	},
    	_searchFields: ['Body'],
    	_cachedFunction: {
    		genContent: true,
    	},
    	_searchFields: ['Body'],
    	genContent: function() {
    		return new Promise(function (fulfill, reject) {
    			fulfill(null);
			});
    	},
  	}
);