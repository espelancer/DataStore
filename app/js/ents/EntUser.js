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
  	}
);