$(function() {
	module('data');
	
	asyncTest('data', function() {
		
		_$.require(['$data'], function() {
		    
			var body = document.body;
			_$.data(body, 'test_data', '2012,11,24,0:54');
			equal(_$.data(body, 'test_data'), '2012,11,24,0:54');
			equal(_$.removeData(body, 'test_data'), '2012,11,24,0:54');
			equal(_$.data(body, 'test_data'));
			start();
		});
	});
});