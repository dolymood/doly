$(function() {
	module('lang');
	asyncTest('lang is[Type]', function() {
		var func = function() {},
		    obj = {},
			ary = [],
			str = '',
			bln = false,
			num = 1,
			rg = /\s/,
			arLike = {length:0};
		_$.require('$lang', function() {
			ok(_$(func).isFunction() === true);
			ok(_$(obj).isObject() === true);
			ok(_$(ary).isArray() === true);
			ok(_$(str).isString() === true);
			ok(_$(bln).isBoolean() === true);
			ok(_$(num).isNumber() === true);
			ok(_$(rg).isRegExp() === true);
			ok(_$(arLike).isArrayLike()=== true);
			ok(_$(func).isObjectLike() === true);
			ok(_$.isObjectLike(rg) === true);
			start();
		});
	});
	asyncTest('lang Array', function() {
	    var ary = [1, 7, 23, 56, 4, 23, 78, 67, 12, 12, 32, 13, 17, 0, 8],
		    ary1 = [1,2,3,5,7,9,0,2],
			ary2 = [0,1,2,3],
			tmp, tmp1, tmp2;
		
		_$.require('$lang', function() {
		    tmp = _$(ary);
			tmp1 = _$(ary1);
			tmp2 = _$(ary2);
			
			equal(tmp2.pop(), ary2);
			
			start();
		});
	});
});