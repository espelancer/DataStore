'use strict';

var GSPromiseExtension = {

  	genm: function(promises) {
  		return (function () {
			var accumulator = {};
			var ready = Promise.resolve(null);
			
			for (var key in promises) {
				if (!promises.hasOwnProperty(key)) {
					continue;
				}
				(function() {
					var index = key;
					ready = ready.then(function () {
						return promises[index];
					}).then(function (value) {
						accumulator[index] = value;
					});
				}());
			}

			return ready.then(function () { return accumulator; });
		}());
  	},
  	
  	genv: function(promises) {
  		return Promise.all(promises);
  	},
}