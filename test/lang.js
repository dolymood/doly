$(function() {
    module('lang');
    asyncTest('lang is[*]', function() {
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
            ok(_$.isNumber(num) === true);
            ok(_$(rg).isRegExp() === true);
            ok(_$(arLike).isArrayLike()=== true);
            ok(_$(func).isObjectLike() === true);
            ok(_$.isObjectLike(rg) === true);
            ok(_$(window).isWindow() === true);
            ok(_$({}).isEmptyObject() === true);
            ok(_$({}).isPlainObject() === true);
            ok(_$.isPlainObject({'a':'a'}) === true);
            ok(_$({length: -2}).isArrayLike() === false);
            ok(_$.isArrayLike({length: 0}) === true);
            ok(_$(arguments).isArrayLike() === true);
            ok(_$.isArrayLike('str', true) === true);
            ok(_$.isEmpty('str') === false);
            ok(_$([]).isEmpty() === true);
            ok(_$({'a':1}).isEmpty() === false);
            ok(_$({}).isEmpty() === true);
            ok(_$(null).isEmpty() === true);
            ok(_$({length:2}).chain().makeArray().type().value() === 'Array');
            ok(_$({length:2}).chain().toArray().type().value() === 'Array');
            ok(_$(arguments).chain().toArray().type().value() === 'Array');
            equal(_$('abc').toArray().join(','), 'a,b,c');
            equal(_$('abc').toArray()[0], 'a');
            ok(_$('abc').makeArray()[0] == 'abc');
            start();
        });
    });
    asyncTest('lang Array[Like]', function() {
        var ary = [1, 7, 23, 56, 4, 23, 78, 67, 12, 12, 32, 13, 17, 0, 8],
            ary1 = [1,2,3,5,7,9,0,2],
            ary2 = [0,1,2,3,9,8,5,4],
            tmp, tmp1, tmp2;
        
        _$.require('$lang', function() {
            tmp = _$(ary);
            tmp1 = _$(ary1);
            tmp2 = _$(ary2);
            
            equal(tmp.pop(), ary);
            equal(tmp1.chain().sort().reverse().value().join(':'), '9:7:5:3:2:2:1:0');
            equal(tmp2.chain().slice(0, 5).concat([10, 11,23,5,4]).sort(function(a, b) {
               return a - b; 
            }).join(',').value(), '0,1,2,3,4,5,9,10,11,23');
            equal(_$(arguments).chain().toArray().push('a').push('b').concat(['d','c']).sort().reverse().value().join(':'), ':d:c:b:a');
            var a = [1,2,4];
            equal(_$(a).each(function(item, index, ary) {
                 ary[index] = item*item;
            }));
            equal(a[1], 4);
            equal(_$(a).chain().map(function(item, index, ary) {
                 return item*item;
            }).indexOf(16).value(), 1);
            equal(_$(a).chain().collect(function(item, index, ary) {
                 return item;
            }).lastIndexOf(1).value(), 0);
            equal(_$(a).chain().collect(function(item, index, ary) {
                 return item;
            }).sortedIndex(8).value(), 2);
            a = {'0': 0, '1': 1, '2':2,'5':5, '4': 4, '3':3, length: 6};
            equal(_$(a).chain().sort().reverse().join(':').value(), '5:4:3:2:1:0');
            equal(_$(a).chain().sort().reverse().pop().pop().join(':').value(), '5:4:3:2');
            equal(a.length, 4);
            equal(_$(a).toArray()[1], 4);
            equal(_$(a).chain().toArray().sort().reverse().value().join(':'), '5:4:3:2');
            
            equal(_$(a).each(function(item, index, ary) {
                 ary[index] = item*item;
            }));
            equal(a[1], 16);
            equal(_$(a).chain().map(function(item, index, ary) {
                 return item*item;
            }).indexOf(81).value(), 2);
            equal(_$(a).chain().push(9).collect(function(item, index, ary) {
                 return item;
            }).lastIndexOf(9).value(), 4);
            equal(_$(a).chain().collect(function(item, index, ary) {
                 return item;
            }).sort(function(a,b) {return a-b}).sortedIndex(10).value(), 3);
            start();
        });
    });
    asyncTest('lang Object', function() {
        _$.require('$lang', function() {
            var a = {
                '1': 1,
                '0': 0
            };
            equal(_$(a).keys().length, 2);
            equal(_$(a).values().length, 2);
            start();
        });
    });
    asyncTest('lang String', function() {
        _$.require('$lang', function() {
            var a = ' a b c d   ';
            equal(a.trim(), 'a b c d');
            start();
        });
    });
    
});