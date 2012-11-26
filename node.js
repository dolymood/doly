/**
 * module node
 */

define('node', ['$support', '$data', '$query'], function(support) {
    'use strict';
	
	var node = {
	    
		text: function(elems, item) {
		    elems = checkEles(elems);
			
		},
		
		// 用于统一配置多态方法的读写访问
		access: function(elems, key, value, getter, setter, scope) {
		    var length = elems.length;
            setter = typeof setter === 'function' ? setter : getter;
            bind = arguments[arguments.length - 1];
            if ( typeof key === 'object' ) {
                for(var k in key){            //为所有元素设置N个属性
                    for ( var i = 0; i < length; i++ ) {
                        setter.call( bind, elems[i], k, key[k] );
                    }
                }
                return elems;
            }
            if ( value !== void 0 ) {
                for ( i = 0; i < length; i++ ) {
                    setter.call(bind, elems[i], key, value );
                }
                return elems;
            } //取得第一个元素的属性, getter的参数总是少于setter
            return length ? getter.call( bind, elems[0], key ) : void 0;
		}
		
	};
	
	function checkEles(elems) {
		if (typeof elems === 'string') {
		    return doly.find(elems);
		} else if (doly.isArrayLike(elems)) {
		    return elems;
		} else if (elems.nodeType) {
		    return [elems];
		} else {
		    doly.error('node.js inner function<checkEles>: arguments error.');
		}
	}
	
	doly.mixin(node);
	return node;
});