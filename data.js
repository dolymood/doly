/**
 * module data
 */

define('data', ['$lang'], function() {
	
	var cache = {},
	    rtype = /[^38]/,
	    retData;
	
	function innerData(elem, name, data) {
	    if (!doly.acceptData(elem)) return;
		
		var isNode = elem.nodeType
		
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
		
		acceptData: function(elem) {
		    return doly.isObjectLike(elem) && rtype.test(elem.nodeType);
		}
	};
	
	doly.mixin(retData);
	return retData;
	
});