/**
 *
 */

define('class', ['$lang'], function() {
    'use strict';
    
    var
	mix = doly.mix,
    
    Class = function(o) {
        if (!(this instanceof Class) && isFunction(o)) {
            return classify(o);
        }
    };
	
	Class.create = function(parent, properties) {
	    var C, init;
		if (!doly.isFunction(parent)) {
		    properties = parent;
		}
		properties || (properties = {});
		parent || (parent = properties.Extends || Class);
		init = properties.init;
		delete properties.inherit;
		delete properties.init;
		C = doly.isFunction(init) ?
		    init :
		    function() { (parent.init || parent).apply(this, arguments); };
		mix(C, doly.mutators);
		inherit(C, parent, properties);
		return classify(C);
	};
    
	// 为一个普通的函数cls添加两个方法，
	// 使得使其具有使用Class.create创建的类对象相同的能力
    function classify(cls) {
        cls.extend || (cls.extend = Class.extend);
        cls.implement || (cls.implement = implement);
        return cls;
    }
    // 给类的prototype动态添加成员
    function implement(properties) {
        var key, value;

        for (key in properties) {
            value = properties[key];
            if (doly.mutators.hasOwnProperty(key)) {
              doly.mutators[key].call(this, value);
            } else {
                this.prototype[key] = value;
            }
        }
    }
    
	Class.extend = function(properties) {
		properties || (properties = {});
		properties.Extends = this;
		return Class.create(properties);
	}
	
	function inherit(C, P, properties) {
	    var F = function() {};
		F.prototype = P.prototype;
		C.prototype = new F;
		this._super = P.prototype;
		mix(C, P);
		mix(C.prototype, properties);
	}
	
    doly.mutators = {
        
		// 继承的父类
		'Extends': function(parent) {
			var existed = this.prototype
			var proto = createProto(parent.prototype)

			// Keep existed properties.
			mix(proto, existed)

			// Enforce the constructor to be what we expect.
			proto.constructor = this

			// Set the prototype chain to inherit from `parent`.
			this.prototype = proto

			// Set a convenience property in case the parent's prototype is
			// needed later.
			this.superclass = parent.prototype

			// Add module meta information in sea.js environment.
			addMeta(proto)
		},
        // 从items这些类中混入属性
		'Implements': function(items) {
			isArray(items) || (items = [items])
			var proto = this.prototype, item

			while (item = items.shift()) {
			    mix(proto, item.prototype || item)
			}
		}
		
    };
    
    doly.Class = Class;
	doly.factory = Class.create;
    return Class;
});