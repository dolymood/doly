/**
 * 
 */

define('lang', function() {
    'use strict';
	
	var toString = Object.prototype.toString,
	    lang = {};
	
	['Array', 'Function', 'Object', 'RegExp'].forEach(function(type) {
		lang['is' + type] = function(obj) {
			return obj && toString.call(obj) === '[object ' + type + ']';
		};
	});

	['Boolean', 'Number', 'String'].forEach(function(type) {
		lang['is' + type] = function( obj ) {
			return typeof obj === type.toLowerCase();
		};
	});
	
	doly.mixin(doly, lang);
	return lang;
});