'use strict';

Ent.create(
  	'EntThread',
 	{
    	_data: {
    		Topic: '',
    	},
    	_searchFields: ['Topic'],
    	_cachedFunction: {'genMessages': true},
    	genMessages: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_THREAD_TO_IMESSAGE');
    	},
    	genUsers: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_THREAD_TO_IUSER');
    	},
  	}
);