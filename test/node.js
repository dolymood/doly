$(function() {
	module('node');
	
	asyncTest('node1', function() {
		
		_$.require('$node', function() {
		    var testNode = _$('#testNode');
			testNode.text('node test');
		    equal(testNode.first().text(), 'node test');
			start();
		});
	});
});