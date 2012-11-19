/**
 *
 */

define('class', ['lang'], function() {
    'use strict';
    
    var mix = doly.mix;
    
    var Class = function(o) {
        if (!(this instanceof Class) && isFunction(o)) {
          return classify(o);
        }
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
    
    Class.mutators = {
        
    };
    
    mix(doly, Class);
    return Class;
});