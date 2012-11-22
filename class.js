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
		parent || (parent = properties.inherit || Class);
		init = properties.init;
		delete properties.inherit;
		delete properties.init;
		C = doly.isFunction(init) ?
		    init :
		    function() { (parent.init || parent).apply(this, arguments); };
		mix(C, doly.mutators).inherit(C, parent, properties);
		return classify(C);
	};
    
    function classify(cls) {
        cls.extend = Class.extend;
        cls.implement = implement;
        return cls;
    }
    
    function implement(properties) {
        var key, value;

        for (key in properties) {
            value = properties[key];
            if (Class.mutators.hasOwnProperty(key)) {
              Class.mutators[key].call(this, value);
            } else {
                this.prototype[key] = value;
            }
        }
    }
    
    doly.mutators = {
        inherit: function(C, P, properties) {
            var F = function() {};
		    F.prototype = P.prototype;
		    C.prototype = new F;
		    this._super = parent;
		   
        },
        implement: function(){
            var target = this.prototype, reg = rconst;
            for(var i = 0, module; module = arguments[i++]; ){
                module = typeof module === "function" ? new module :module;
                Object.keys(module).forEach(function(name){
                    if( !reg.test(name) ){
                        target[name] = module[name];
                    }
                }, this );
            }
            return this;
        },
        extend: function(){//扩展类成员
            var bridge = {}
            for(var i = 0, module; module = arguments[i++]; ){
                $.mix( bridge, module );
            }
            for( var key in bridge ){
                if( !unextend[key] ){
                    this[key] =  bridge[key]
                }
            }
            return this;
        }
    };
    
    doly.Class = Class;
	doly.factory = Class.create;
    return Class;
});