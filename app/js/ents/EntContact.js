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
    	},
    	_searchFields: ['Email'],
    	
    	addToUser: function(userID) {
    		return GSPromiseExtension.genm({
    			'user_to_contact': function() {
    				Assoc.set(userID, this.getID(), 'ACCOS_USER_TO_ICONTACT');
    			}.bind(this),
    			'contact_to_user': function() {
    				Assoc.set(this.getID(), userID, 'ASSOC_ICONTACT_TO_USER');
    			}.bind(this),
    		});
    	},
  	}
);