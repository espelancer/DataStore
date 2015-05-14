'use strict';

var EntLoader = {

	load : function(id, entType) {
		return {'Body':'EntLoader'};
	},
	
	save : function(id, entType, data) {
	},

  	_loadFromDB: function() {
      	var db = new PouchDB('mydb', {adapter: 'websql'});
      	db.info().then(function (info) {
        	console.log(info);
      	});
  	}
};