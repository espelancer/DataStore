'use strict';

Ent.create(
  	'EntThread',
 	{
    	_data: {
    		Topic: '',
    	},
    	_searchFields: ['Topic'],
    	_cachedFunction: {
    		genMessages: true,
    		genUsers: true,
    	},
    	
    	genMessages: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_THREAD_TO_IMESSAGE');
    	},
    	genUsers: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_THREAD_TO_IUSER');
    	},
    	
    	addUser: function(userID) {
    		return GSPromiseExtension.genm({
    			'thread_to_user': function() {
    				Assoc.set(this.getID(), userID, 'ACCOS_THREAD_TO_IUSER');
    			}.bind(this),
    			'user_to_thread': function() {
    				Assoc.set(userID, this.getID(), 'ACCOS_IUSER_TO_THREAD');
    			}.bind(this),
    		});
    	},
    	addMessage: function(messageID) {
    		return GSPromiseExtension.genm({
    			'thread_to_message': function() {
    				Assoc.set(this.getID(), messageID, 'ACCOS_THREAD_TO_IMESSAGE');
    			}.bind(this),
    			'message_to_thread': function() {
    				Assoc.set(messageID, this.getID(), 'ACCOS_IMESSAGE_TO_THREAD');
    			}.bind(this),
    		});
    	},
  	}
);