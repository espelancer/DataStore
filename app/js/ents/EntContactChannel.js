'use strict';

Ent.createInterface('IEntContactChannel', {});

Ent.create(
  	'EntEmailContactChannel',
 	{
 		_interfaces: {
 			IEntContactContact: true,
 		},
    	_data: {
    		Email: '',
    	},
    	_searchFields: ['Email'],
    	_cachedFunction: {
    		genContact: true,
    	},
    	
    	genContact: function() {
    		return new Promise(function (fulfill, reject) {
    			Assoc.getAll(this.getID(), 'ASSOC_ICONTACTCHANNEL_TO_CONTACT')
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
    	
    	addToContact: function(contactID) {
    		return GSPromiseExtension.genm({
    			'contact_to_channel': function() {
    				Assoc.set(contactID, this.getID(), 'ACCOS_CONTACT_TO_ICONTACTCHANNEL');
    			}.bind(this),
    			'channel_to_contact': function() {
    				Assoc.set(this.getID(), contactID, 'ASSOC_ICONTACTCHANNEL_TO_CONTACT');
    			}.bind(this),
    		});
    	},
  	}
);