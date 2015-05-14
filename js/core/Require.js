'use strict';

var _cssList = {};

var componentList = {};

function require_js(path, callback) {
	if (document.getElementById(path)) {
		return;
	}

	var s = document.createElement("script");
	s.id = path;
	s.src = path;
	s.async = true;
	if (callback) {
		s.onload = callback;
	}
	
	var fjs = document.getElementsByTagName('script')[0];
	fjs.parentNode.insertBefore(s, fjs);
}

function require_css(path) {
	if (_cssList[path]) {
		return;
	}

	var s = document.createElement("link");
	s.rel = "stylesheet"
	s.href = path;
 	$("head").append(s);

  	_cssList[path] = true;
}

function require_module(str, callback) {
	var path = 'gs_module/';
	require_js(path.concat(str).concat('.js'), callback);
}

function require_js_list(paths, callback) {
  var fetch_list = {};
  var fjs = document.getElementsByTagName('script')[0];
  for (var key in paths) {
    if (!paths.hasOwnProperty(key)) {
      continue;
    }
    
    var path = paths[key];
    if (document.getElementById(path)) {
		return;
	}
	
	fetch_list[path] = true;
	
	var s = document.createElement("script");
	s.id = path;
	s.src = path;
	s.async = true;
	s.onload = function() {
	  delete fetch_list[path];
	  if ($.isEmptyObject(fetch_list)) {
	    callback();
	  }
	};
	fjs.parentNode.insertBefore(s, fjs);
  }
}