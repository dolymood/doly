/**
 * test module
 */
define('module', ['base'], function(base) {
    
	doly.log('test_require:::::' + base.output);
	
	var test = {
	    output: 'module done'
	};
	
	return test;
	
});