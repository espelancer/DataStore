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
    	_cachedFunction: {
    		genUser: true,
    	},
    	
    	genUser: function() {
    		return new Promise(function (fulfill, reject) {
    			Assoc.getAll(this.getID(), 'ASSOC_ICONTACT_TO_USER')
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