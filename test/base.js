$(function() {
	module('base');
	
	asyncTest('config', 2, function() {
		_$.config({
		    'baseUrl': 'test/js/',
			'alias': {
			    $base: _$.config('baseUrl') + 'test/js/base.js'
			}
		});
		ok(_$.config('alias')['$base'] === _$.config('baseUrl') + 'base.js');
		_$.require(['$base'], function(base) {
		    equal(base.output, 'named define');
			start();
		});
		// stop();
	});
	asyncTest('define', 6, function() {
		_$.config({
			'alias': {
			    $module: _$.config('baseUrl') + 'js/module.js'
			}
		});
		_$.require(['$base'], function(base) {
		    equal(base.output, 'named define');
			start();
		});
		stop();
		_$.require(['$base', 'module', 'define', '$module'], function(base, m1, def, m2) {
		    equal(base.output, 'named define');
			equal(m1.output, 'deps define(require)');
			equal(m2.output, 'deps(path) define(require)');
			equal(def.output, 'anonymous define');
			start();
		});
		stop();
		_$.require('defineObject', function(o) {
			equal(o.output, 'anonymous define(object)');
			start();
		});
	});
});