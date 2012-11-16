/**
 * test module
 */
define('module', ['base'], function(base) {
    
	console.log('test_require:::::' + base.output);
	
	var test = {
	    output: 'module done'
	};
	
	return test;
	
});