/**
 * test path
 */
define('module', ['../base'], function(base) {
    
	doly.log('test_path_require:::::'+ base.output);
	var test = {
	    output: 'inner module done.'
	};
	
	return test;
	
});