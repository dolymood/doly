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
			ok(_$.matchesSelector(stop_button, '#stop_button'));
			ok(_$.matches('#qunit', qunit));
			equal(_$.text(stop_button), 'Stop Tests');
			ok(_$.containsEle(_$.find('body')[0], _$.find('#id1')[0]));
			start();
		});
	});
});