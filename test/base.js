$(function() {
	module('base');
	
	asyncTest('config', function() {
		_$.config({
		    'baseUrl': 'test/js/',
			'alias': {
			    $base: _$.config('baseUrl') + 'test/js/base.js'
			}
		});
		ok(_$.config('alias')['$base'] === _$.config('baseUrl') + 'base.js');
		stop();
		_$.require(['$base'], function(base) {
		    equal(base.output, 'named define');
			start();
		});
	});
	asyncTest('define', function() {
		stop();
		_$.require(['$base'], function(base) {
		    equal(base.output, 'named define');
			start();
		});
		stop();
		_$.require(['$base', 'module', 'define', 'js/module'], function(base, m1, def, m2) {
		    equal(base.output, 'named define');
			equal(m1.output, 'deps define(require)');
			equal(m2.output, 'deps(path) define(require)');
			equal(def.output, 'anonymous define');
			start();
		});
	});
	
	
});