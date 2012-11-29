/**
 * module class
 */

define('class', ['$lang'], function() {
    'use strict';
    
    var
    F        = function() {},
    mix      = doly.mix,
    isArray  = Array.isArray,
    unextend = doly.oneObject(['_super', '_superClass', 'extend', 'implement', 'prototype']),

    Class    = function(o) {
        if (!(this instanceof Class) && isFunction(o)) {
            return classify(o);
        }
    };

    // 提供两种方式(继承父类ParentClass)：
    // Class.create(ParentClass, {...});
    // Class.create({
    //     Extends: ParentClass，
    //     Implements: OthersClass//从其他类（数组或者单个类）中混入属性
    // });
    Class.create = function(P, properties) {
        var C, init;
        if (!doly.isFunction(P)) {
            properties = P;
            P = null;
        }
        properties || (properties = {});
        P || (P = properties.Extends || Class);
        init = properties.init;
        delete properties.Extends;
        delete properties.init;
        C = doly.isFunction(init) ?
            init :
            function() { P.apply(this, arguments); };
        inherit(C, P, properties);
        return classify(C);
    };

    // 为一个普通的函数cls添加两个方法，
    // 使得使其具有使用Class.create创建的类对象相同的能力
    function classify(cls) {
        cls.extend || (cls.extend = Class.extend);
        cls.implement || (cls.implement = implement);
        return cls;
    }
    // 给类的prototype动态添加成员（不能包含Extends ？）
    function implement(properties) {
        var mutators = doly.mutators,
            proto = this.prototype,
            key, value;

        for (key in properties) {
            if (doly.has(properties, key)) {
                value = properties[key];
                if (doly.has(mutators, key)) {
                    mutators[key].call(this, value);
                    delete properties[key];
                } else {
                    proto[key] = value;
                }
            }
        }
    }
    // 创建子类的快捷方式 直接调用extend即可
    Class.extend = function(properties) {
        properties.Extends = this;
        return Class.create(properties);
    }

    function inherit(C, P, properties) {
        var key;
        F.prototype = P.prototype;
        C.prototype = new F;//添加原型方法
        //复制父类的静态成员
        for (key in P) {
            if (doly.has(P, key) && !unextend[key]) {
                C[key] = P[key];
            }
        }
        C._super = P.prototype;//重新指定_super方便调用
        C._superClass = P;
        implement.call(C, properties);
        C.prototype.constructor = C;//修整constructor
    }

    doly.mutators = {
        // 从items这些类中混入属性
        'Implements': function(items) {
            var proto = this.prototype;
            isArray(items) || (items = [items]);
            items.forEach(function(item, index, ary) {
                mix(proto, item.prototype || item);
            });
        }
    };

    doly.classify = classify;
    doly.Class = Class;
    doly.factory = Class.create;
    doly.implement = implement;
    return Class;
});