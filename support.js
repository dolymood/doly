/**
 * module support
 */

define('support', ['$ready'], function() {
    'use strict';
	
	var div = document.createElement("div"),
	    support;
	div.setAttribute('className', 't');
	
	support = doly.support = {
	    
	};
	
	doly.ready(function() {
		
	});
	
	return support;
});