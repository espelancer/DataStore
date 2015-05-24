'use strict';

Ent.create(
  	'EntTopic',
 	{
    	_data: {
    		Name: '',
    	},
    	_searchFields: ['Name'],
    	_cachedFunction: {
    		genMessages: true,
    		genContacts: true,
    	},
    	
    	genMessages: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_TOPIC_TO_IMESSAGE');
    	},
    	genContacts: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_TOPIC_TO_ICONTACT');
    	},
    	
    	addContact: function(contactID) {
    		return GSPromiseExtension.genm({
    			'topic_to_contact': function() {
    				Assoc.set(this.getID(), userID, 'ACCOS_TOPIC_TO_ICONTACT);
    			}.bind(this),
    			'contact_to_topic': function() {
    				Assoc.set(userID, this.getID(), 'ACCOS_ICONTACT_TO_TOPIC');
    			}.bind(this),
    		});
    	},
    	addMessage: function(messageID) {
    		return GSPromiseExtension.genm({
    			'topic_to_message': function() {
    				Assoc.set(this.getID(), messageID, 'ACCOS_TOPIC_TO_IMESSAGE');
    			}.bind(this),
    			'message_to_topic': function() {
    				Assoc.set(messageID, this.getID(), 'ACCOS_IMESSAGE_TO_TOPIC');
    			}.bind(this),
    		});
    	},
  	}
);