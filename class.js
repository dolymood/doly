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
	    var init;
		if (!doly.isFunction(parent)) {
		    properties = parent;
		}
		properties || (properties = {});
		parent || (parent = properties.inherit || Class);
		init = properties.init;
		delete properties.inherit;
		delete properties.init;
		function SubClass() {
		    parent.apply(this, arguments);
		}
		
		return 
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
        inherit : function( parent,init ) {
            var bridge = function() { }
            if( typeof parent == "function"){
                for(var i in parent){//继承类成员
                    this[i] = parent[i];
                }
                bridge.prototype = parent.prototype;
                this.prototype = new bridge ;//继承原型成员
                this._super = parent;//指定父类
            }
            this._init = (this._init || []).concat();
            if( init ){
                this._init.push(init);
            }
            this.toString = function(){
                return (init || bridge) + ""
            }
            var proto = this.prototype;
            proto.setOptions = function(){
                var first = arguments[0];
                if( typeof first === "string" ){
                    first =  this[first] || (this[first] = {});
                    [].splice.call( arguments, 0, 1, first );
                }else{
                    [].unshift.call( arguments,this );
                }
                $.Object.merge.apply(null,arguments);
                return this;
            }
            return proto.constructor = this;
        },
        implement:function(){
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