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
    		SenderContactChannelID: null,
    	},
    	_searchFields: ['Body'],
    	_cachedFunction: {
    		genContent: true,
    		genTopics: true,
    	},
    	
    	genContent: function() {
    		return new Promise(function (fulfill, reject) {
    			fulfill(null);
			});
    	},
    	genTopic: function() {
    		return new Promise(function (fulfill, reject) {
    			Assoc.getAll(this.getID(), 'ACCOS_IMESSAGE_TO_TOPIC')
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
    	
    	addInThread: function(topicID) {
    		return GSPromiseExtension.genm({
    			'topic_to_message': function() {
    				Assoc.set(topicID, this.getID(), 'ACCOS_TOPIC_TO_IMESSAGE');
    			}.bind(this),
    			'message_to_topic': function() {
    				Assoc.set(this.getID(), topicID, 'ACCOS_IMESSAGE_TO_TOPIC');
    			}.bind(this),
    		});
    	},
  	}
);