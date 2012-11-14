/**
 * test path
 */
define('js/module', ['base'], function(base) {
    
	console.log('test_path_require.');
	var test = {
	    output: 'inner module done.'
	};
	
	return test;
	
});