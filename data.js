/**
 * module data
 */

define('data', ['$lang'], function() {
	
	var cache = {};
	
	function innerData(elem, name, data) {
	    
	}
	
	function innerRemoveData(elem, name) {
	    
	}
	
	var retData = {
	    
		cachedData: cache,
		
		data: function(elem, name, data) {
		    return innerData(elem, name, data);
		},
		
		removeData: function(elem, name) {
		    return innerRemoveData(elem, name);
		},
		
		acceptData: function() {
		    
		}
	};
	
	doly.mixin(retData);
	return retData;
	
});