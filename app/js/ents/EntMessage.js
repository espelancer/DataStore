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
    	},
    	_searchFields: ['Body'],
    	_cachedFunction: {
    		genContent: true,
    		genThreads: true,
    	},
    	
    	genContent: function() {
    		return new Promise(function (fulfill, reject) {
    			fulfill(null);
			});
    	},
    	genThread: function() {
    		return new Promise(function (fulfill, reject) {
    			Assoc.getAll(this.getID(), 'ACCOS_IMESSAGE_TO_THREAD')
    			.then(function(res) {
    				if (!res) {
    					fulfill(null);
    				} else {
    					fulfill(head(res));
    				}
    			}).catch(function (err) {
					reject(err);
				});
    		});
    	},
    	
    	addInThread: function(threadID) {
    		return GSPromiseExtension.genm({
    			'thread_to_message': function() {
    				Assoc.set(threadID, this.getID(), 'ACCOS_THREAD_TO_IMESSAGE');
    			}.bind(this),
    			'message_to_thread': function() {
    				Assoc.set(this.getID(), threadID, 'ACCOS_IMESSAGE_TO_THREAD');
    			}.bind(this),
    		});
    	},
  	}
);