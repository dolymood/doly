$(function() {
	module('data');
	
	asyncTest('data', function() {
		
		_$.require(['$data'], function() {
		    
			var body = _$(document.body);
			body.data('test_data', '2012,11,24,0:54');
			equal(body.data('test_data'), '2012,11,24,0:54');
			body.removeData('test_data');
			equal(body.data('test_data'));
			start();
		});
	});
});