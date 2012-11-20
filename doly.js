/**
 * doly基础库
 */

+ function(window, document, undefined) {
    'use strict';
    
    var
    Op              = Object.prototype,
    _$_              = window._$,
    HTML            = document.documentElement,
    HEAD            = document.head || document.getElementsByTagName('head')[0],
    toStr           = Op.toString,
    version         = '0.0.1',
    rmakeid         = /(#.+|\W)/g,
    modules         = {}, // 模块加载器的缓存对象
    loadings        = [], // 加载中的模块
    rReadyState     = /loaded|complete|undefined/i,
    baseElement     = HEAD.getElementsByTagName('base')[0],
    hasOwnProperty  = Op.hasOwnProperty,
    all = 'lang_fix,lang,support,class,flow,query,data,node,attr,css_fix,css,event_fix,event,ajax,fx',
    
    class2type = {
        'NaN'                     : 'NaN',
        'null'                    : 'Null',
        'undefined'               : 'Undefined',
        '[object global]'         : 'Window',
        '[object DOMWindow]'      : 'Window',
        '[object HTMLDocument]'   : 'Document',
        '[object HTMLCollection]' : 'NodeList',
        '[object StaticNodeList]' : 'NodeList',
        '[object IXMLDOMNodeList]': 'NodeList'
    },
    
    doly = function(obj) {
        if (obj instanceof doly) return obj; // 本身就是doly实例化对象
        if (!(this instanceof doly)) return new doly(obj);
        this._wrapped = obj;
    },
    
    STATUS = {
        uninitialized : 0,
        loading       : 1,
        loaded        : 2,
        interactive   : 3,
        complete      : 4
    },
    
    _config = {
        baseUrl: '',
        alias: {},
        charset: {}
    },
    
    /*
     * 给@target对象添加成员
     * @param {Object} target 目标对象
     * @param {Object} source 源对象
     * @param {Boolean} override 是否覆盖
     * @return {Object} 目标对象
     */
    mix = function (target, source, override) {
        if (!target || !source) return;
        override = override || true;

        for (var key in source) {
            if (hasOwnProperty.call(source, key) && (override || !(key in target))) {
                target[key] = source[key];
            }
        }
        return target;
    },
    
    /*
     * 取得@arg的类型或判定@arg的类型是否是@str类型
     * @param {Any} obj 任意值
     * @param {String} str 可选，要比较的类型
     * @return {String|Boolean}
     */
    type = function(obj, str) {
        var result = class2type[(obj == null || obj !== obj ) ? obj : toStr.call(obj)] || obj.nodeName;
        if (str) return str == result;
        return result;
    },
    
    // 链式调用
    result = function(obj) {
        return this._chain ? doly(obj).chain() : obj;
    };
    
    window._$ = window.doly = doly;
    
    mix(doly, {
        mix: mix,
        type: type,
        HTML: HTML,
        HEAD: HEAD,
        rword: /[^, ]+/g,
        modules: modules,
        VERSION: version,
        noop: function() {},
        
        has: function(obj, key) {
            return hasOwnProperty.call(obj, key);
        },
        
        /*
         * 将多个对象合并成一个新对象，后面的对象属性将覆盖前面的
         * @param {Object} 一个或多个对象
         * @return {Object} 合并后的新对象
         */
        merge: function() {
            var result = {}, i = arguments.length;
            for ( ; i-- ; ) {
                mix(result, arguments[i]);
            }
            return result;
        },
        
        /*
         * 获得或者修改模块加载器的配置
         * @param {Object|String} ops 配置对象
         */
        config: function(ops) {
            if (typeof ops == 'string' && doly.has(_config, ops)) {
                return _config[ops];
            }
            var charset = ops.charset,
                alias = ops.alias, key;
            if (ops.baseUrl) _config.baseUrl = parseUrl(ops.baseUrl, _config.baseUrl);
            if (charset && type(charset, 'Object')) {
                doly.mix(_config.charset, charset);
            }
            if (alias && type(alias, 'Object')) {
                if (alias != _config.alias) {
                    for (key in alias) {
                        if (!doly.has(alias, key)) continue;
                        if (_config.alias[key]) throw key + '在alias中重复'
                        _config.alias[key] = alias[key];
                    }
                }
            }
        },
        
        // sea.js todo
        log: function() {
            if (typeof console === void 0) return;

            var args = Array.apply([], arguments);

            var type = 'log';
            var last = args[args.length - 1];
            console[last] && (type = args.pop());

            if (console[type].apply) {
                console[type].apply(console, args);
                return;
            }

            var length = args.length;
            if (length === 1) {
                console[type](args[0]);
            } else if (length === 2) {
                console[type](args[0], args[1]);
            } else if (length === 3) {
                console[type](args[0], args[1], args[2]);
            } else {
                console[type](args.join(' '));
            }
        },
        
        /*
         * 数组化
         * @param {ArrayLike} nodes 要处理的类数组对象
         * @param {Number} start 可选,起始下标
         * @param {Number} end  可选,规定从何处结束选取
         * @return {Array}
         */
        slice: function(nodes, start, end) {
            var ret = [], n = nodes.length, i;
            if (end === void 0 || typeof end == 'number' && isFinite(end)) {
                start = parseInt(start, 10) || 0;
                end = end == void 0 ? n : parseInt(end, 10);
                if (start < 0) {
                    start += n;
                }
                if (end > n) {
                    end = n;
                }
                if (end < 0) {
                    end += n;
                }
                for (i = start; i < end; i++) {
                    ret[i - start] = nodes[i];
                }
            }
            return ret;
        },
        
        // 给doly对象(包括prototype)添加自定义方法或者属性(仅限doly自身)
        mixin: function(obj) {
            var func, key;
            for (key in obj) {
                if (doly.has(obj, key)) {
                    func = obj[key];
                    doly[key] = func;
                    if (type(func, 'Function')) {
                        (function(func, key) {
                            doly.prototype[key] = function() {
                                var args = [this._wrapped];
                                args.push.apply(args, arguments);
                                return result.call(this, func.apply(doly, args));
                            };
                        })(func, key);
                    }
                }
            }
        },
        
        // 链式调用
        chain: function(obj) {
            return doly(obj).chain();
        }

    });
    
    // 配置baseURl
    (function(scripts) {
        var //r = /(^|(?:.*?\/))doly\.js(?:\?|$)/,文件名可能被更改
            cur = scripts[scripts.length - 1],
            url = getScriptAbsoluteSrc(cur);
        url = url.replace(/[?#].*/, '');
        _config.baseUrl = url.substr(0, url.lastIndexOf('/')) + "/";
    })(document.getElementsByTagName('script'));
    
    /*
     * 解析url
     * @param {String} url 要解析的url
     * @param {String} base 基本url地址
     * @return {String} 解析后的url
     */
    function parseUrl(url, base) {
        var modUrl = '',
            tmp, st, arr;

        if (/^(\w+)(\d)?:.*/.test(url)) {
            modUrl = url;
        } else {
            tmp = url.charAt(0);
            st = url.slice(0, 2);
            if (tmp !== '.' && tmp != '/') { // 相对于根路径
                modUrl = base + url;
            } else if (st == './') { // 相对于兄弟路径
                modUrl = (base[base.length - 1] == '/' ? base : (base + '/')) + url.substr(2);
            } else if (st == '..') { // 相对于父路径
                arr = base.replace(/\/$/, '').split('/');
                tmp = url.replace(/\.\.\//g, function() {
                    arr.pop();
                    return '';
                });
                modUrl = arr.join('/') + '/' + tmp;
            }
        }
        return modUrl;
    }
    
    var module = {
        
        update: function(key, status, factory, args, deps) {
            var mod = modules[key];
            if (!mod) mod = modules[key] = {};
            mod.status = status;
            mod.args = args || [];
            mod.deps = deps;
            mod.factory = factory;
        },
        
        /*
         * 根据url得到文件地址
         * @param {String} url url
         * @param {String} base 基于的url地址
         * @return {String} 解析后的文件地址
         */
        parse: function(url, base) {
            var modUrl = '',
                ext = 'js',
                tmp, st;
            if (/^[-a-z0-9_$]{2,}$/i.test(url) && _config.alias[url]) {
                modUrl = _config.alias[url];
            } else {
                base = base.substr(0, base.lastIndexOf('/')) + '/';
                modUrl = parseUrl(url, base);
            }
            tmp = modUrl.replace(/[?#].*/, '');
            if (/\.(\w+)$/.test(tmp)) {
                ext = RegExp.$1;
            }
            if (ext != "css" && tmp == modUrl && !/\.js$/.test(modUrl)) {
                modUrl += ".js";
            }
            
            return [modUrl, ext];
        }
        
    };
    
    function getScriptAbsoluteSrc(script) {
        return script.hasAttribute ?
                   script.src : script.getAttribute( 'src', 4);
    }
    
    var innerDefine = function() {
        var args = Array.apply([], arguments),
            module = Ns.modules[nick],
            last, lastFunc;
        if (typeof args[0] == 'string') {
            args.shift();
        }
        args.unshift(nick);
        module.status = 1;
        last = args.length - 1;
        lastFunc = args[last];
        if (typeof lastFunc == "function") {
            args[last] =  parent.Function('doly', 'return ' + lastFunc)(Ns);
        }
        Ns.define.apply(module, args);
    }
    
    function loadJS(url) {
        var iframe = document.createElement('iframe'),
            charset = _config.charset[url],
            codes = [
            '<script>',
                'var nick ="', url, '", doly = {}, Ns = parent.doly;',
                'doly.define = ', innerDefine, ';',
                'var define = doly.define;',
            '<\/script>',
            '<script src="', url + '?ts=' + Date.now(),'" ',
            (charset ? ('charset="' + charset + '" '): ''),
            (document.uniqueID ? 'onreadystatechange="' : 'onload="'),
                'if(/loaded|complete|undefined/i.test(this.readyState)){',
                    'Ns.check();',
                    'Ns.checkFail(self.document, nick);',
                '}',
                '" onerror="Ns.checkFail(self.document, nick, true);" >',
            '<\/script>'],
            doc;
        module.update(url, STATUS.loading);
        iframe.style.display = 'none';
        // http://www.tech126.com/https-iframe/
        // http://www.ajaxbbs.net/post/webFront/https-iframe-warning.html
        if (!'1'[0]) { // IE6 iframe在https协议下没有的指定src会弹安全警告框
            iframe.src = 'javascript:false';
        }
        HEAD.insertBefore(iframe, HEAD.firstChild);
        doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.write(codes.join(''));
        doc.close();
        iframe.onload = function() {
            if (window.opera && doc.ok != 1) { // ok写在checkFail里面
                doly.checkFail(doc, url, true);
            }
            doc.write('<body/>');
            HEAD.removeChild(iframe);
            iframe = null;
        };
    }
    
    function loadJS1(url) {
        var script = document.createElement('script'),
            charset = _config.charset[url];
        module.update(url, STATUS.loading);
        script.async = 'async';
        if (charset) {
            script.charset = charset;
        }
        
        script.onload = script.onerror = script.onreadystatechange = function() {
            if (rReadyState.test(script.readyState)) {
                script.onload = script.onerror = script.onreadystatechange = null;
                HEAD.removeChild(script);
                script = null;
                doly.check();
            }
        };
        script.src = url;
        baseElement ?
            HEAD.insertBefore(script, baseElement) :
            HEAD.appendChild(script);
    }
    
    function loadCSS(url) {
        var id = url.replace(rmakeid, '');
        if (document.getElementById(id)) return;
        var link =  document.createElement('link'),
            charset = _config.charset[url] || 'utf-8';
        link.charset = charset,
        link.rel = 'stylesheet';
        link.href = url;
        link.type = 'text/css';
        link.id = id;
        HEAD.insertBefore(link, HEAD.firstChild);
    }
    
    mix(doly, {
        
        require: function(list, factory, nameUrl) {
            var len = arguments.length,
                base = _config.baseUrl,
                START = STATUS.loading,
                OK = STATUS.complete,
                args = [],
                deps = {},
                tn = 0,
                dn = 0,
                i = 0,
                modLen, ary, url, ext, mod, key;
            
            if (len < 1) throw 'require called with no arguments';
            if (typeof list == 'string') list = [list];
            if (len == 1 && type(list, 'Function')) {
                factory = list;
                list = [];
            }
            // factory 中的require
            for (modLen = list.length; i < modLen; i++) {
                ary = module.parse(list[i], nameUrl || base);
                url = ary[0];
                ext = ary[1];
                mod = modules[url];
                
                if (ext == 'js') {
                    tn++;
                    if (!mod) {
                        loadJS(url);
                    } else if (mod.status == OK) {
                        dn++;
                    }
                    if (!deps[url]) {
                        args.push(url);
                        deps[url] = "doly";
                    }
                } else if (ext == 'css') {
                    loadCSS(url);
                }
            }
            key = nameUrl || 'd_o_l_y' + Date.now().toString(32);
            if (dn == tn) {
                return install(key, args, factory);
            }
            module.update(key, START, factory, args, deps);
            loadings.unshift(key);
            doly.check();
        },
        
        check: function() {
            var i = 0,
                j = loadings.length,
                OK = STATUS.complete,
                key, deps, args, factory, len, mod;
            loop:
            for ( ; key = loadings[--j]; ) {
                mod = modules[key];
                args = mod.args;
                len = args.length;
                factory = mod.factory;
                for (i = 0; i < len; i++) {
                    if (modules[args[i]].status != OK) {
                        continue loop;
                    }
                }
                if (mod.status != OK) {
                    loadings.splice(j, 1);
                    install(key, args, factory);
                    doly.check();
                }
            }
        },
        
        checkFail: function(doc, url, error) {
            doc && (doc.ok = 1);
            if (error || !modules[url].status) {
                doly.log((error || modules[url].status) + "   " + url);
                doly.log('Failed to load [[ ' + url + ' ]]' + modules[url].status);
            }
        }
        
    });
    
    function install(key, deps, factory) {
        var args = [],
            i = 0,
            mod = modules[key],
            len = deps.length, ret;
        for (; i < len; i++) {
            args.push(modules[deps[i]].exports);
        }
        
        if (!mod) {
            mod = modules[key] = {};
        }
        
        mod.status = STATUS.complete;
        
        if (factory) {
            ret = factory.apply(window, args);
        }
        if (ret != void 0) {
            mod.exports = ret;
        }
        return ret;
    }
    
    /*
     * 定义模块的方法
     * @param {String} name 模块名
     * @param {String / Array} deps 依赖模块列表
     * @param {Function} factory 模块的内容
     */
    window.define = doly.define = function(name, deps, factory) {
        var fac;
        if (arguments.length == 2) {
            factory = deps;
            deps = [];
        }
        // 有依赖包
        if (deps) {
            deps = typeof deps == 'string' ? [deps] : deps;
        } else {
            deps = [];
        }
        fac = factory;
        if (!type(fac, 'Function')) {
            factory = function() {
                return fac;
            };
        }
        doly.require(deps, factory, name);
    };
    'Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList,Object'.replace(doly.rword, function(name) {
        class2type['[object ' + name + ']'] = name;
    });
    all.replace(doly.rword, function(name) {
        _config.alias['$' + name] = _config.baseUrl + name + '.js';
    });
    doly.mixin(doly);
    doly.mix(doly.prototype, {
        
        chain: function() {
            this._chain = true;
            return this;
        },
        
        value: function() {
            return this._wrapped;
        }
        
    });
    
}(window, document);