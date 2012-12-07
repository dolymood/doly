/**
 * module lang
 */

define('lang', Array.isArray ? [] : ['$lang_fix'], function() {
    'use strict';
    
    var Op             = Object.prototype,
        Ap             = Array.prototype,
        lang           = {},
        rword          = doly.rword,
        slice          = doly.slice,
        breaker        = {},
        toString       = Op.toString,
        nativeIndexOf  = Ap.indexOf,
        hasOwnProperty = Op.hasOwnProperty,
        // 链式调用
        result = function(obj) {
            return this._chain ? doly(obj).chain() : obj;
        },
        // JSON reg
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g;
    
    ['Function', 'Object', 'RegExp'].forEach(function(type) {
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
    
    lang.keys = Object.keys;
    
    var each = lang.each = lang.forEach = function(obj, callback, context) {
        if (!obj) return;
        if (obj.forEach === Ap.forEach) {
            obj.forEach(callback, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (callback.call(context, obj[i], i, obj) === false) return;
            }
        } else {
            for (var key in obj) {
                if (doly.has(obj, key)) {
                    if (callback.call(context, obj[key], key, obj) === false) return;
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
    
    lang.filter = function(obj, callback, context) {
        var results = [];
        each(obj, function(value, index, list) {
            if (callback.call(context, value, index, list)) {
                results.push(value);
            }
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
        if (array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
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
        var type = doly.type(obj), len;
        if (type === 'Array' || type === 'NodeList' || type === 'Arguments' || str && type === 'String') {
            return true;
        }
        if(type === 'Object') {
            len = obj.length;
            return len >= 0 && parseInt(len) === len;
        }
        return false;
    };
    
    lang.isObjectLike = function(obj) {
        return obj === Object(obj);
    };
    
    lang.isArray = Array.isArray;

    lang.inArray = function(elem, ary, i) {
        if (arr) {
            return nativeIndexOf.call(arr, elem, i);
        }
        return -1;
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
    
    // 数组或者类数组的merge
    lang.merge = function(first, second) {
        var l = second.length,
            i = first.length,
            j = 0;

        if (typeof l === 'number') {
            for (; j < l; j++) {
                first[i++] = second[j];
            }
        } else {
            while (second[j] !== void 0) {
                first[i++] = second[j++];
            }
        }
        first.length = i;
        return first;
    };
    
    // 数组或者类数组的深度合并
    lang.deepMerge = function(first, second) {
        var l = second.length,
            i = first.length,
            j = 0;

        if (typeof l === 'number') {
            for (; j < l; j++) {
                first[i++] = doly.deepClone(second[j]);
            }
        } else {
            while (second[j] !== void 0) {
                first[i++] = doly.deepClone(second[j++]);
            }
        }
        first.length = i;
        return first;
    };
    
    lang.makeArray = function(obj) {
        if (obj == null) {
            return [];
        }
        if(doly.isArrayLike(obj)) {
            return slice(obj);
        }
        return [obj];
    };
    
    lang.toArray = function(obj) {
        if (obj == null) {
            return [];
        }
        if(doly.isArrayLike(obj, true)) {
            return slice(obj);
        }
        return doly.values(obj);
    };
    
    // 转换为驼峰式
    lang.camelCase = function(target) {
        if (target.indexOf('-') < 0 && target.indexOf('_') < 0) {
            return target;
        }
        return target.replace(/[-_][^-_]/g, function (match) {
            return match.charAt(1).toUpperCase();
        });
    };
    
    // jquery
    lang.parseXML = function(data) {
        var xml, tmp;
        if (!data || typeof data !== 'string') {
            return null;
        }
        try {
            if (window.DOMParser) { // Standard
                tmp = new DOMParser();
                xml = tmp.parseFromString(data , 'text/xml');
            } else { // IE
                xml = new ActiveXObject('Microsoft.XMLDOM');
                xml.async = 'false';
                xml.loadXML(data);
            }
        } catch(e) {
            xml = undefined;
        }
        if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length) {
            doly.error('Invalid XML: ' + data);
        }
        return xml;
    };
    
    lang.parseJSON = function(data) {
        if (!data || typeof data != 'string') return null;
        data = data.trim();
        if (window.JSON && window.JSON.parse) {
            return window.JSON.parse(data);
        } else {
            if (rvalidchars.test(data.replace(rvalidescape, '@')
                .replace(rvalidtokens, ']')
                .replace(rvalidbraces, ''))) {
                return (new Function( 'return ' + data))();
            }
        }
    };
    
    lang.globalEval = lang.parseJS = function(code) {
        if (code && /\S/.test(code)) {
            (window.execScript || function(code) {
                window['eval'].call(window, code);
            })(code);
        }
    };
    
    doly.mixin(lang, true);
    var nativeBind = Function.prototype.bind;
    doly.bind = function bind(func, context) {
        if (!doly.isFunction(func)) doly.error('TypeError: Object #<Object> has no method "bind"');
        if (func.bind === nativeBind) return nativeBind.apply(func, slice(arguments, 1));        
    };
	
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
    // 返回新的结果(去除slice)
    'concat,join'.replace(rword, function(name) {
        var method = Ap[name];
        doly.prototype[name] = function() {
            return result.call(this, method.apply(this._wrapped, arguments));
        };
    });
    return doly;
});