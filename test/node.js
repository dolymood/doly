$(function() {
	module('node');
	
	asyncTest('node1', function() {
		_$.require('$node', function() {
			var testNode = _$('#testNode');
			testNode.text('node test');
		    equal(testNode.text(), 'node test');
			testNode.html(testNode.html() + '<div>test<p>this is p tag</p></div><a href="http://www.baidu.com">tag a</a>');
			equal(testNode.html(), 'node test<div>test<p>this is p tag</p></div><a href="http://www.baidu.com">tag a</a>');
			equal(testNode.text(), 'node testtestthis is p tagtag a');
			equal(testNode.size(), 1);
			
			for(var i = 0; i < 10; i++) {// 故意为之
			    testNode.html(testNode.html() + '<div>create new div : ' + i + '</div>');
			}
			var newDiv = testNode.find('div');
			equal(newDiv.size(), 11);
			// newDiv.html('new new div html');passed
			// newDiv.getEle(1).innerHTML = 'new new div html';passed
			newDiv.eachEle(function() {
			    D(this).html(D(this).html() + '--each--');
			}).sliceEle(1, 5).html('slice...').first().html('first...').end().last().html('last...');
			
			newDiv.even().html('new even...');
			newDiv.odd().empty().text('after empty...');
			
			start();
		});
	});
});