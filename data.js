/**
 * module data
 */

define('data', ['$lang'], function() {
    'use strict';
    
    var rtype = /[^38]/, // 非注释
        retData;
    
    function innerData(elem, name, data, pvt) {
        if (!doly.acceptData(elem)) return;
        
        var id = doly.getUID(elem),
            isEle = elem.nodeType === 1,
            getByName = typeof name === 'string',
            cache = isEle ? doly.dolyCache : elem,
            dt = cache['dolyCache_' + id] || (cache['dolyCache_' + id] = {
                data: {}
            })
            dtclone = dt;
        // 解析data-*，使得也能通过data得到
        if (isEle && !dt.parsedAttrs){
            var attrs = elem.attributes,
                i = 0, attr, key;
            for (; attr = attrs[i++];) {
                key = attr.name;
                if (key.length > 5 && !key.indexOf('data-')) {
                    doly.parseData(elem, key.slice(5), dtclone, attr.value);
                }
            }
            dt.parsedAttrs = true;
        }
        if (!pvt) dt = dt.data;
        if (name && typeof name == 'object') {
            doly.mix(dt, name);
        } else if (getByName && data !== void 0) {
            dt[name] = data;
        }
        if (getByName) {
            if (name in dt) {
                return dt[name];
            } else if (isEle && !pvt) {
                return doly.parseData(elem, name, dtclone);
            }
        } else {
            return dt;
        }
    }
    
    function innerRemoveData(elem, name, pvt) {
        if (!doly.acceptData(elem)) return;
        
        var id = doly.getUID(elem);
        if (!id) {
            return;
        }
        var clear = true, ret = typeof name == "string",
            cache = elem.nodeType === 1  ? doly.dolyCache : elem,
            dt = cache['dolyCache_' + id],
            dtClone = dts;
        if (dt && ret) {
            if (!pvt) dt = dt.data;
            if (dt) {
                ret = dt[name];
                delete dt[name];
            }
            // 判断是否彻底清除cache数据
            loop:
            for(var key in dtClone) {
                if (key == 'data') {
                    for (var i in dtClone.data) {
                        clear = false;
                        break loop;
                    }
                } else {
                    clear = false;
                    break loop;
                }
            }
        }
        if (clear) {
            delete cache['dolyCache_' + id];
        }
        return ret;
    }
    
    retData = {
        
        dolyCache: {},
        
        data: function(elem, name, data) {
            return innerData(elem, name, data);
        },
        
        _data: function(elem, name, data) {
            return innerData(elem, name, data, true);
        },
        
        removeData: function(elem, name) {
            return innerRemoveData(elem, name);
        },
        
        _removeData: function(elem, name) {
            return innerRemoveData(elem, name, true);
        },
        
        acceptData: function(elem) {
            return doly.isObjectLike(elem) && rtype.test(elem.nodeType);
        },
        
        parseData: function(elem, name, cache, value) {
            var key = doly.camelCase(name),
                data, _eval;
            if (cache && (key in cache)) return cache[key];
            if (arguments.length != 4) { //取数据的情况
                var attr = 'data-' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
                value = elem.getAttribute(attr);
            }
            if (typeof value === 'string') {
                // 需要转换的: {}, [], null, false, true, NaN
                if (/^(?:\{.*\}|\[.*\]|null|false|true|NaN)$/.test(value) || +value + '' === value) {
                    _eval = true;
                }
                try {
                    data = _eval ? eval('('+ value + ')') : value;
                } catch(e) {
                    data = value;
                }
                if (cache) {
                    cache[key] = data;
                }
            }
            return data;
        }
    };
    
    doly.mixin(retData);
    return retData;
    
});