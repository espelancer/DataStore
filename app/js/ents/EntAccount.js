'use strict';

Ent.create(
  	'EntAccount',
 	{
    	_data: {
    		First: '',
    		Last: '',
    		Company: '',
    		Email: '',
    		EmailPassword: '',
    		Mobile: '',
    	},
    	_searchFields: ['Email'],
    	_cachedFunction: {
    		genContacts: true,
    	},
    	
    	genContacts: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_ACCOUNT_TO_ICONTACT');
    	},
    	
    	addContact: function(contactID) {
    		return GSPromiseExtension.genm({
    			'account_to_contact': function() {
    				Assoc.set(this.getID(), contactID, 'ASSOC_ACCOUNT_TO_ICONTACT');
    			}.bind(this),
    			'contact_to_account': function() {
    				Assoc.set(contactID, this.getID(), 'ACCOS_ICONTACT_TO_ACCOUNT');
    			}.bind(this),
    		});
    	},
  	}
);