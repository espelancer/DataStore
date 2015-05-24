'use strict';

Ent.createInterface('IEntContact', {});

Ent.create(
  	'EntContact',
 	{
 		_interfaces: {
 			IEntContact: true,
 		},
    	_data: {
    		Name: '',
    	},
    	_searchFields: ['Name'],
    	_cachedFunction: {
    		genContactChannels: true,
    		genContactGroups: true,
    		genTopics: true,
    	},
    	
    	genContactChannels: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_CONTACT_TO_ICONTACTCHANNEL');
    	},
    	genContactGroups: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_CONTACT_TO_GROUP');
    	},
    	genTopics: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_ICONTACT_TO_TOPIC');
    	},
    	
    	addInGroup: function(groupID) {
    		return GSPromiseExtension.genm({
    			'group_to_contact': function() {
    				Assoc.set(groupID, this.getID(), 'ACCOS_GROUP_TO_CONTACT');
    			}.bind(this),
    			'contact_to_group': function() {
    				Assoc.set(this.getID(), groupID, 'ASSOC_CONTACT_TO_GROUP');
    			}.bind(this),
    		});
    	},
    	addInTopic: function(topicID) {
    		return GSPromiseExtension.genm({
    			'topic_to_contact': function() {
    				Assoc.set(topicID, this.getID(), 'ACCOS_TOPIC_TO_ICONTACT');
    			}.bind(this),
    			'contact_to_topic': function() {
    				Assoc.set(this.getID(), topicID, 'ACCOS_ICONTACT_TO_TOPIC');
    			}.bind(this),
    		});
    	},
    	addContactChannel: function(channelID) {
    		return GSPromiseExtension.genm({
    			'contact_to_channel': function() {
    				Assoc.set(this.getID(), channelID, 'ACCOS_CONTACT_TO_ICONTACTCHANNEL');
    			}.bind(this),
    			'channel_to_contact': function() {
    				Assoc.set(channelID, this.getID(), 'ASSOC_ICONTACTCHANNEL_TO_CONTACT');
    			}.bind(this),
    		});
    	},
  	}
);

Ent.create(
  	'EntContactGroup',
 	{
 		_interfaces: {
 			IEntContact: true,
 		},
    	_data: {
    		Name: '',
    	},
    	_searchFields: ['Name'],
    	_cachedFunction: {
    		genContacts: true,
    		genTopics: true,
    	},
    	genContacts: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_GROUP_TO_CONTACT');
    	},
    	genTopics: function() {
    		return Assoc.getAll(this.getID(), 'ACCOS_ICONTACT_TO_TOPIC');
    	},
    	
    	addInTopic: function(topicID) {
    		return GSPromiseExtension.genm({
    			'topic_to_group': function() {
    				Assoc.set(topicID, this.getID(), 'ACCOS_TOPIC_TO_ICONTACT');
    			}.bind(this),
    			'group_to_topic': function() {
    				Assoc.set(this.getID(), topicID, 'ACCOS_ICONTACT_TO_TOPIC');
    			}.bind(this),
    		});
    	},
    	addContact: function(contactID) {
    		return GSPromiseExtension.genm({
    			'group_to_contact': function() {
    				Assoc.set(this.getID(), contactID, 'ACCOS_GROUP_TO_CONTACT');
    			}.bind(this),
    			'contact_to_group': function() {
    				Assoc.set(contactID, this.getID(), 'ASSOC_CONTACT_TO_GROUP');
    			}.bind(this),
    		});
    	},
  	}
);