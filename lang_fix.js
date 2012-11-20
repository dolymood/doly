/**
 * lang_fix
 */

define('lang_fix', function() {
    'use strict';
    
    var Ap             = Array.prototype,
        Fp             = Function.prototype,
        Sp             = String.prototype,
        Dp             = Date.prototype;
    
    // Array
    Array.isArray || (Array.isArray = function(obj) {
        return doly.type(obj, 'Array');
    });
    Ap.indexOf || (Ap.indexOf = function(item, i) {
        var len = this.length;
        i = parseInt(i) || 0;
        if (i < 0) i = Math.max(0, (i + len));
        for (; i < len; i++) {
            if (this[i] === item) return i;
        }
        return -1;
    });
    Ap.lastIndexOf || (Ap.lastIndexOf = function(item, i) {
        var len = this.length;
        i = parseInt(i) || len - 1;
        if (i < 0) i += len;
        for (; i >= 0; i--) {
            if (this[i] === item) return i;
        }
        return -1;
    });
    Ap.every || (Ap.every = function(fn, context) {
        var len = this.length, i = 0;
        for (; i < len; i++) {
            if (!fn.call(context, this[i], i, this)) {
                return false;
            }
        }
        return true;
    });
    Ap.some || (Ap.some = function(fn, context) {
        var len = this.length, i = 0;
        for (; i < len; i++) {
            if (fn.call(context, this[i], i, this)) {
                return true;
            }
        }
        return false;
    });
    Ap.forEach || (Ap.forEach = function(fn, context) {
        var len = this.length, i = 0;
        for (; i < len; i++) {
            fn.call(context, this[i], i, this);
        } 
    });
    Ap.map || (Ap.map = function(fn, context) {
        var len = this.length, i = 0, result = [];
        for (; i < len; i++) {
            result[i] = fn.call(context, this[i], i, this);
        }
        return result;
    });
    Ap.filter || (Ap.filter = function(fn, context) {
        var len = this.length, i = 0, result = [], tmp;
        for (; i < len; i++) {
            tmp = this[i];
            if (fn.call(context, tmp, i, this)) {
                result.push(tmp);
            }
        }
        return result;
    });
    Ap.reduce || (Ap.reduce = function(fn, result) {
        var len = this.length, i = 0;
        if (result === void 0) result = this[i++];
        for (; i < len; i++) {
            result = fn(result, this[i], i, this);
        }
        return result;
    });
    Ap.reduceRight || (Ap.reduceRight = function(fn, result) {
        var len = this.length, i = len - 1;
        if (result === void 0) result = this[i--];
        for (; i >= 0; i--) {
            result = fn(result, this[i], i, this);
        }
        return result;
    });
    // 修正IE67下unshift不返回数组长度的问题
    if ([].unshift(1) !== 1) {
        var unshift = Ap.unshift;
        Ap.unshift = function() {
            unshift.apply(this, arguments);
            return this.length;
        };
    }
    
    // Object
    Object.keys || (Object.keys = function(obj) {
        var keys = [], key;
        for (key in obj && doly.has(obj, key)) {
            keys.push(key);
        }
        return keys;
    });
    
    // String
    Sp.trim || (Sp.trim = function() {
        var rtriml = /^[\s\uFEFF\xA0]+/,
            rtrimr = /^[\s\uFEFF\xA0]+$/;
        return this.replace(rtriml, '').replace(rtrimr, '');
    });
    
    // Date
    if (!Date.now) {
        Date.now = function(){
            return +new Date;
        };
        
        Dp.getYear = function() {
            return this.getFullYear() - 1900;
        };
        
        Dp.setYear = function(year) {
            return this.setFullYear(year);
        };
    }

    // Function
    var slice = Ap.slice;
    Fp.bind || (Fp.bind = function(context) {
        if (arguments.length < 2 && context=== void 0) return this;
        var fn = this, args = slice.call(arguments, 1);
        return function() {
            return fn.apply(context, args.concat(slice.call(arguments)));
        };
    });

});