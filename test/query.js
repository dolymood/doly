$(function() {
	module('query');
	
	asyncTest('query', function() {
		
		_$.require(['$query'], function() {
		    
			var getId = function(id) {
			    return document.getElementById(id);
			};//
			var qunit = _$.find('#qunit');
			var stop_button = _$.find('#stop_button')[0];
			equal(qunit[0], getId('qunit'));
			ok(_$(stop_button).matchesSelector('#stop_button'));
			ok(_$('#qunit').matches(qunit));
			equal(_$(stop_button).text(), 'Stop Tests');
			ok(_$(document.body).eleContains(_$.find('#id1')[0]));
			start();
		});
	});
});