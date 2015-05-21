'use strict';

Ent.createInterface('IEntUser', {});

Ent.create(
  	'EntUser',
 	{
 		_interfaces: {
 			IEntUser: true,
 		},
    	_data: {
    		Name: '',
    	},
    	_searchFields: ['Name'],
    	_cachedFunction: {
    		genContacts: true,
    		genUserGroups: true,
    		genThreads: true,
    	},
    	genContacts: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_USER_TO_ICONTACT');
    	},
    	genUserGroups: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_USER_TO_GROUP');
    	},
    	genThreads: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_IUSER_TO_THREAD');
    	},
    	
    	addInGroup: function(groupID) {
    		return GSPromiseExtension.genm({
    			'group_to_user': function() {
    				Assoc.set(groupID, this.getID(), 'ACCOS_GROUP_TO_USER');
    			}.bind(this),
    			'user_to_group': function() {
    				Assoc.set(this.getID(), groupID, 'ASSOC_USER_TO_GROUP');
    			}.bind(this),
    		});
    	},
    	addInThread: function(threadID) {
    		return GSPromiseExtension.genm({
    			'thread_to_user': function() {
    				Assoc.set(threadID, this.getID(), 'ACCOS_THREAD_TO_IUSER');
    			}.bind(this),
    			'user_to_thread': function() {
    				Assoc.set(this.getID(), threadID, 'ACCOS_IUSER_TO_THREAD');
    			}.bind(this),
    		});
    	},
    	addContact: function(contactID) {
    		return GSPromiseExtension.genm({
    			'user_to_contact': function() {
    				Assoc.set(this.getID(), contactID, 'ACCOS_USER_TO_ICONTACT');
    			}.bind(this),
    			'contact_to_user': function() {
    				Assoc.set(contactID, this.getID(), 'ASSOC_ICONTACT_TO_USER');
    			}.bind(this),
    		});
    	},
  	}
);

Ent.create(
  	'EntUserGroup',
 	{
 		_interfaces: {
 			IEntUser: true,
 		},
    	_data: {
    		Name: '',
    	},
    	_searchFields: ['Name'],
    	_cachedFunction: {
    		genUsers: true,
    		genThreads: true,
    	},
    	genUsers: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_GROUP_TO_USER');
    	},
    	genThreads: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_IUSER_TO_THREAD');
    	},
    	
    	addInThread: function(threadID) {
    		return GSPromiseExtension.genm({
    			'thread_to_user': function() {
    				Assoc.set(threadID, this.getID(), 'ACCOS_THREAD_TO_IUSER');
    			}.bind(this),
    			'user_to_thread': function() {
    				Assoc.set(this.getID(), threadID, 'ACCOS_IUSER_TO_THREAD');
    			}.bind(this),
    		});
    	},
    	addUser: function(userID) {
    		return GSPromiseExtension.genm({
    			'group_to_user': function() {
    				Assoc.set(this.getID(), userID, 'ACCOS_GROUP_TO_USER');
    			}.bind(this),
    			'user_to_group': function() {
    				Assoc.set(userID, this.getID(), 'ASSOC_USER_TO_GROUP');
    			}.bind(this),
    		});
    	},
  	}
);