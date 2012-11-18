/**
 * lang
 */

define('lang', Array.isArray ? null : 'lang_fix', function() {
    'use strict';
	
	var Op             = Object.prototype,
	    Ap             = Array.prototype,
	    lang           = {},
		type           = doly.type,
		rword          = doly.rword,
		slice          = Ap.slice,
		breaker        = {},
	    toString       = Op.toString,
		hasOwnProperty = Op.hasOwnProperty,
		// 链式调用
		result = function(obj) {
			// return this._chain ? doly(obj).chain() : obj;
			return doly(obj);
		};
	
	['Array', 'Function', 'Object', 'RegExp'].forEach(function(type) {
		lang['is' + type] = function(obj) {
			return obj && toString.call(obj) === '[object ' + type + ']';
		};
	});

	['Boolean', 'Number', 'String'].forEach(function(type) {
		lang['is' + type] = function(obj) {
			return typeof obj === type.toLowerCase();
		};
	});
	
	lang.identity = function(value) {
	    return value;
	};
	
	lang.values = function(obj) {
	    var values = [], key;
		for (key in obj) if (doly.has(obj, key)) values.push(obj[key]);
		return values;
	};
	
	var each = lang.each = lang.forEach = function(obj, callback, context) {
	    if (!obj) return;
		if (obj.forEach === Ap.forEach) {
		    obj.forEach(callback, context);
		} else if (obj.length === +obj.length) {
		    for (var i = 0, l = obj.length; i < l; i++) {
				if (callback.call(context, obj[i], i, obj) === breaker) return;
			}
		} else {
		    for (var key in obj) {
				if (doly.has(obj, key)) {
				    if (callback.call(context, obj[key], key, obj) === breaker) return;
				}
			}
		}
	};
	
	lang.map = lang.collect = function(obj, callback, context) {
	    var results = [];
		if (obj == null) return results;
		if (obj.map === Ap.map) return obj.map(callback, context);
		each(obj, function(value, index, list) {
		    results[results.length] = callback.call(context, value, index, list);
		});
		return results;
	};
	
	lang.sortedIndex = function(array, obj, iterator, context) {
		iterator = iterator || doly.identity;
		var value = iterator.call(context, obj),
		    low = 0, high = array.length, mid;
		while (low < high) {
		  mid = (low + high) >>> 1;
		  iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
		}
		return low;
	};
	
	lang.indexOf = function(array, item, isSorted) {
	    if (!array) return -1;
		var i = 0, len = array.length;
		if (isSorted) {
		    if (typeof isSorted == 'number') {
			    i = (isSorted < 0 ? Math.max(0, len + isSorted) : isSorted);
		    } else {
			    i = doly.sortedIndex(array, item);
			    return array[i] === item ? i : -1;
		    }
		}
		if (array.indexOf === Ap.indexOf) return array.indexOf(item, isSorted);
		for (; i < len; i++) if (array[i] === item) return i;
		return -1;
	};
	
	lang.lastIndexOf = function(array, item, from) {
		if (!array) return -1;
		var hasIndex = from != null,
		    i;
		if (array.lastIndexOf === Ap.lastIndexOf) {
		    return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
		}
		i = (hasIndex ? from : array.length);
		while (i--) if (array[i] === item) return i;
		return -1;
	};
	
	// 判断是否为空对象
	lang.isEmptyObject = function(obj) {
	    for (var key in obj) {
			return false;
		}
		return true;
	};
	
	// 判断是否为纯粹的对象
	lang.isPlainObject = function(obj) {
	    if (!obj || !doly.isObject(obj)) {
            return false;
        }
        var name;
        try {
            for(name in obj) {
                if(!doly.has(obj, name)) {
                    return false;
                }
            }
        } catch(e) {
            return false;
        }
        return true;
	};
	
	lang.isArrayLike = function(obj, str) {
	    var type = type(obj), len;
		if (type === 'Array' || type === 'NodeList' || type === 'Arguments' || str && type === 'String') {
			return true;
		}
		if(type === 'Object') {
			len = obj.length;
			return len >= 0 && parseInt(len) === len;
		}
		return false;
	};
	
	lang.isObject = function(obj) {
	    return obj === Object(obj);
	};
	
	lang.isWindow = function(obj) {
	    return obj && obj == obj.window;
	};
	
	lang.isEmpty = function(obj) {
	    if (obj == null) return true;
		if (doly.isArray(obj) || doly.isString(obj)) return obj.length === 0;
		for (var key in obj) if (doly.has(obj, key)) return false;
		return true;
	};
	
	lang.error = function(msg) {
	    throw new Error(msg);
	};
	
	lang.makeArray = function(obj) {
	    if (obj == null) {
			return [];
		}
		if(doly.isArrayLike(obj)) {
			return slice.call(obj);
		}
		return doly.values(obj);
	};
	
	lang.parseHTML = function() {
	    
	};
	
	lang.parseJSON = function() {
	    
	};
	
	lang.parseXML = function() {
	    
	};
	
	lang.globalEval = function(code) {
	    if (code && /\S/.test(code)) {
			(window.execScript || function(code) {
				window['eval'].call(window, code);
			})(code);
		}
	};
	
	doly.mixin(doly, lang);
	
	// 改变的原数组
	'pop,push,reverse,shift,sort,splice,unshift'.replace(rword, function(name) {
	    var method = Ap[name];
		doly.prototype[name] = function() {
		    var obj = this._wrapped;
		    method.apply(obj, arguments);
		    if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];// why
		    return result.call(this, obj);
		};
	});
	// 返回新的结果
	'concat,join,slice'.replace(rword, function(name) {
	    var method = Ap[name];
		doly.prototype[name] = function() {
		    return result.call(this, method.apply(this._wrapped, arguments));
		};
	});
	
});