/**
 * module node
 */

define('node', ['$support', '$data', '$query'], function(support) {
    'use strict';
    
    var
    push = Array.prototype.push,
    node = {
        
        pushStack: function(elems, name, selector) {
            var ret = new doly();
            ret.__hasInit__ = true;
            ret.length = 0;
            ret._wrapped = [];
            if (doly.isArray(elems)) {
                push.apply(ret._wrapped, elems);
            } else {
                doly.merge(ret._wrapped, elems);
            }
            ret.prevObject = this;
            ret.context = this.context;
            ret.ownerDocument = this.ownerDocument;
            if (name === 'find') {
                ret.selector = this.selector + (this.selector ? ' ' : '') + selector;
            } else if (name) {
                ret.selector = this.selector + '.' + name + '(' + selector + ')';
            }
            doly.merge(ret, ret._wrapped);
            return ret;
        },
        
        find: function(expr) {
            init.call(this);
            var ret, i, len, tmp, self;
            if (typeof expr !== 'string') {
                self = this;
                tmp = doly(expr);
                init.call(tmp);
                return this.pushStack(tmp.filter(function(value, index, list) {
                    for ( i = 0, len = self.length; i < len; i++) {
                        if (doly.containsEle(self[i], value)) {
                            return true;
                        }
                    }
                }));
            }
            ret = [];
            for (i = 0, len = this.length; i < len; i++) {
                doly.find(expr, this[i], ret);
            }
            ret = this.pushStack(ret.length > 1 ? doly.unique(ret) : ret);
            ret.selector = (this.selector ? this.selector + ' ' : '' ) + expr;
            return ret;
        },
        
        size: function() {
            init.call(this);
            return this.length;
        },
        
        sliceEle: function(start, end) {
            init.call(this);
            return this.pushStack(doly.slice(this, start, end));
        },
        
        getEle: function(num) {
            init.call(this);
            return num == null ? doly.toArray(this) : this[num < 0 ? this.length + num : num];
        },
        
        eachEle: function(callback) {
            init.call(this);
            doly.each(function(item, index, ary) {
                return callback.call(item);
            });
            return this;
        },
        
        mapEle: function(callback) {
            init.call(this);
            return this.pushStack(doly.map(this, function(item, index, ary) {
                return callback.call(item);
            }));
        },
        
        eq: function(i) {
            return (i = +i) === -1 ? this.sliceEle(i) : this.sliceEle(i, i + 1);
        },
        
        gt: function(i) {
            return this.sliceEle(i + 1, this.length);
        },
        
        lt: function(i) {
            return this.sliceEle(0, i);
        },
        
        first: function() {
            return this.eq(0);
        },

        last: function() {
            return this.eq(-1);
        },
        
        even: function() {
            init.call(this);
            return this.pushStack(doly.filter(this, function(item, i) {
                return i % 2 === 0;
            }));
        },
        
        odd: function() {
            init.call(this);
            return this.pushStack(doly.filter(this, function(item, i) {
                return i % 2 === 1;
            }));
        },
        
        remove: function(selector, keepData) {
            init.call(this);
            var i = 0, ele;
            for (; (ele = this[i++]) != null; ) {
                if (!selector || doly.filterEle(selector, [ele]).length) {
                    if (!keepData && ele.nodeType === 1) {
                        doly.cleanData(ele.getElementsByTagName('*'));
                        doly.cleanData([ele]);
                    }
                    if (ele.parentNode) {
                        ele.parentNode.removeChild(ele);
                    }
                }
            }
            return this;
        },
        
        empty: function() {
            init.call(this);
            var i = 0, ele;
            for (; (ele = this[i++]) != null; ) {
                if (ele.nodeType === 1) {
                    doly.cleanData(ele.getElementsByTagName('*'));
                }
                while (ele.firstChild) {
                    ele.removeChild(ele.firstChild);
                }
            }
            return this;
        },
        
        text: function(item) {
            init.call(this);
            return doly.access(this, 0, item, function(el) {
                if (!el) {
                    return '';
                } else if (el.tagName == 'OPTION' || el.tagName == 'SCRIPT') {
                    return el.text;
                }
                return el.textContent || el.innerText || doly.getText([el]);
            }, function() {
                this.empty().append((this.ownerDocument || document).createTextNode(item));
            }, this);
        },
        
        html: function(item) {
            init.call(this);
            item = item === void 0 ? item : item == null ?  '' : item + '';
            return doly.access(this, 0, item, function(el) {
                // 如果当前元素不是null, undefined,并确保是元素节点或者nodeName为XML,则进入分支
                // 为什么要刻意指出XML标签呢?因为在IE中,这标签并不是一个元素节点,而是内嵌文档
                // 的nodeType为9,IE称之为XML数据岛
                if (el && (el.nodeType === 1 || /xml/i.test(el.nodeName))) {
                    return 'innerHTML' in el ? el.innerHTML : innerHTML(el);
                }
                return null;
            }, function(el, _, value) {
                // 接着判断innerHTML属性是否符合标准,不再区分可读与只读
                // 用户传参是否包含了script style meta等不能用innerHTML直接进行创建的标签
                // 及像col td map legend等需要满足套嵌关系才能创建的标签, 否则会在IE与safari下报错
                if (support.innerHTML && (!rcreate.test(value) && !rnest.test(value))) {
                    try {
                        for (var i = 0; el = this[i++]; ) {
                            if (el.nodeType === 1) {
                                doly.slice(el.getElementsByTagName('*')).each(clearData);
                                el.innerHTML = value;
                            }
                        }
                        return;
                    } catch(e) {};
                }
                this.empty().append(value);
            }, this);
        },
        
        outerHTML: function(item) {
            init.call(this);
            return doly.access(this, 0, item, function(el) {
                if (el && el.nodeType === 1) {
                    return 'outerHTML' in el ? el.outerHTML : outerHTML(el);
                }
                return null;
            }, function() {
                this.empty().replace(item);
            }, this);
        },
        
        cloneEle: function(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.mapEle(function () {
                return cloneNode(this, dataAndEvents, deepDataAndEvents);
            });
        },
        
        has: function(selector) {
            init.call(this);
            var elems = init.call(doly(selector, this)),
                len = elems.length, i;
            return this.filterEle(function() {
                for (i = 0; i < len; i++) {
                    if (doly.containsEle(this, elems[i])) {
                        return true;
                    }
                }
            });
        },
        
        not: function(selector) {
            init.call(this);
            return this.pushStack(winnow(this, selector, true));
        },

        filterEle: function(selector) {
            init.call(this);
            return this.pushStack(winnow(this, selector, false));
        },
        
        is: function(selector) {
            init.call(this);
            var elems = doly.find(selector),
                i = 0,
                obj = {}, uid, node;
            for ( ; node = elems[i++]; ) {
                uid = doly.getUID(node);
                obj[uid] = 1;
            }
            return doly.slice(this).some(function(el) {
                return obj[doly.getUID(el)];
            });
        },
        
        closest: function(selectors, context) {
            init.call(this);
            var elems = init.call(doly(selectors, context || this.ownerDocument)),
                i = 0, ret = [], cur;
            for ( ; cur = this[i++]; ) {
                while (cur) {
                    if (doly.inArray(cur, elems) > -1) {
                        ret.push(cur);
                        break;
                    } else { // 否则把当前节点变为其父节点
                        cur = cur.parentNode;
                        if (!cur || !cur.ownerDocument || cur === context || cur.nodeType === 11) {
                            break;
                        }
                    }
                }
            }
            ret = ret.length > 1 ? doly.unique(ret) : ret;
            return this.pushStack(ret);
        },
        
        index: function(elem) {
            init.call(this);
            var first = this[0];
            if (!elem) { //如果没有参数，返回第一元素位于其兄弟的位置
                return (first && first.parentNode) ? this.first().prevAll().length : -1;
            }
            // 返回第一个元素在新实例中的位置
            if (typeof elem === 'string') {
                return doly.inArray(this[0], init.call(doly(elem)));
            }
            return doly.inArray(elem.doly_ ? (elem.__hasInit__ ? elem[0] : init.call(elem)[0]) : elem, this);
        }
    };
    
    var rtag = /^[a-zA-Z]+$/;
    function init() {
        if (this.__hasInit__) return this; // 已经初始化过了
        var expr = this._wrapped, _wrapped, doc, context, nodes; //用作节点搜索的起点
        this.__hasInit__ = true; // 设置已经初始化参数
        if (!expr) { // 没有参数的情况 直接返回
            this.length = 0;
            this._wrapped = [];
            return this;
        }
        
        if (doly.isArray(expr) && expr.__selector__) { // 处理参数-doly(selector, context)
            context = expr[1] || document; // context
            expr = expr[0]; // selector|expr
            if (!context.nodeType) { // 如果context不是元素
                this.ownerDocument  = expr.nodeType === 9 ? expr : expr.ownerDocument;
                if (!(context.find && context.find === this.find)) { // context 不是doly实例化对象
                    context = new doly(context); // 实例化之
                }
                _wrapped = this._wrapped = context.find(expr)._wrapped; // 根据context查找expr，得到结果
                this.length || (this.length = 0);
                return doly.merge(this, _wrapped); // 将结果合并到this上
            }
        }
        
        if (expr.nodeType) { // 元素 直接返回即可
            this.context = this[0] = expr;
            this.length = 1;
            this._wrapped = [expr];
            return this;
        }
        this.selector = expr + '';
        if (typeof expr === 'string') { // 是字符串
            doc = this.ownerDocument = !context ? document : getDoc(context, context[0]);
            var scope = context || doc;
            if (expr.charAt(0) === '<' && expr.charAt(expr.length - 1) === '>' && expr.length >= 3) {
                nodes = doly.parseHTML(expr, doc);//分支5: 动态生成新节点
                nodes = nodes.childNodes;
            } else if (rtag.test(expr)) {//分支6: getElementsByTagName
                nodes = scope.getElementsByTagName(expr);
            } else {//分支7：进入选择器模块
                nodes  = doly.find(expr, scope);
            }
            _wrapped = this._wrapped = doly.slice(nodes);
            this.length || (this.length = 0);
            return doly.merge(this, _wrapped);
        } else {//分支8：处理数组，节点集合或者doly对象(doly(expr))或window对象
            if (expr.doly_ && !expr.__hasInit__) { // doly(selector) 是doly实例 但是没有init
                init.apply(expr);
            }
            this.ownerDocument = getDoc(expr[0]);
            _wrapped = this._wrapped = doly.isArrayLike(expr) ?  expr : [expr];
            this.length || (this.length = 0);
            doly.merge(this, _wrapped);
            delete this.selector;
            return this;
        } 
    }
    
    // filterEle and not(^异或)
    function winnow(elems, selector, not) {
        var ret = [], doc = elems.ownerDocument;
        elems = elems._wrapped;
        if (!doly.isArray(elems)) {
            elems = doly.slice(elems);
        }
        if (typeof selector === 'string') {
            var fits = doly.find(selector, doc);
            elems.forEach(function(node) {
                if (node.nodeType === 1) {
                    if ((fits.indexOf(node) !== -1) ^ not) {
                        ret.push(node);
                    }
                }
            });
        } else if (doly.isFunction(selector)) {
            return elems.filter(function(node, i) {
                return !!selector.call(node, node, i) ^ not;
            });
        } else if (selector.nodeType) {
            return elems.filter(function(node) {
                return (node === expr) ^ not;
            });
        }
        return ret;
    }
    
    function getDoc(){
        for (var i = 0, len = arguments.length, el; i < len; i++) {
            if (el = arguments[i]) {
                if (el.nodeType) {
                    return el.nodeType === 9 ? el : el.ownerDocument;
                } else if (el.setTimeout) {//widdow
                    return el.document;
                }
            }
        }
        return document;
    }
    
    //parseHTML的辅助变量
    var translations  = {
        option:   [1, '<select multiple="multiple">', '</select>'],
        legend:   [1, '<fieldset>', '</fieldset>'],
        thead:    [1, '<table>', '</table>'],
        tr:       [2, '<table><tbody>', '</tbody></table>'],
        td:       [3, '<table><tbody><tr>', '</tr></tbody></table>'],
        col:      [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
        area:     [1, '<map>', '</map>'],
        _default: [0, '', '']
    };

    if (!support.htmlSerialize) {//IE678在用innerHTML生成节点时存在BUG，不能直接创建script,link,meta,style与HTML5的新标签
        translations._default = [1, 'X<div>', '</div>'];
        translations.param = [1, 'X<object>', '</object>', function(elem) {
            return elem.replace(/<param([^>]*)>/gi, function(m, s1, offset) {
                var name = s1.match(/name=["']([^"']*)["']/i);
                return name ? (name[1].length ?
                    // It has a name attr with a value
                    '<param' + s1 + '>' :
                    // It has name attr without a value
                    '<param' + s1.replace(name[0], 'name="_' + offset +  '"') + '>') :
                // No name attr
                '<param name="_' + offset +  '"' + s1 + '>';
            });
        }];
    }
    translations.optgroup = translations.option;
    translations.tbody = translations.tfoot = translations.colgroup = translations.caption = translations.thead;
    translations.th = translations.td;
    var
    rtbody = /<tbody[^>]*>/i,
    rtagName = /<([\w:]+)/,//取得其tagName
    rxhtml =  /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rcreate = support.htmlSerialize ? /<(?:script)/ig : /(<(?:script|link|style))/ig,
    types = doly.oneObject('text/javascript','text/ecmascript','application/ecmascript','application/javascript','text/vbscript'),
    //需要处理套嵌关系的标签
    rnest = /<(?:td|th|tf|tr|col|opt|leg|cap|area)/,
    adjacent = 'insertAdjacentHTML',
    insertApapter = {
        prepend: function(el, node) {
            el.insertBefore(node, el.firstChild);
        },
        append: function(el, node) {
            el.appendChild(node);
        },
        before: function(el, node) {
            el.parentNode.insertBefore(node, el);
        },
        after: function(el, node) {
            el.parentNode.insertBefore(node, el.nextSibling);
        },
        replace: function(el, node) {
            el.parentNode.replaceChild(node, el);
        },
        prepend2: function(el, html) {
            el[adjacent]('afterBegin', html);
        },
        append2: function(el, html) {
            el[adjacent]('beforeEnd', html);
        },
        before2: function( el, html) {
            el[adjacent]('beforeBegin', html);
        },
        after2: function(el, html) {
            el[adjacent]('afterEnd', html);
        }
    };
    
    var insertAdjacentNode = function(elems, fn, item) {
        for(var i = 0, el; el = elems[i]; i++) {//第一个不用复制，其他要
            fn( el, i ? cloneNode(item, true, true) : item);
        }
    }
    var insertAdjacentHTML = function(elems, slowInsert, fragment, fast, fastInsert, html) {
        for (var i = 0, el; el = elems[i++];) {
            if (fast) {
                fastInsert(el, html);
            } else {
                slowInsert(el, fragment.cloneNode(true));
            }
        }
    }
    var insertAdjacentFragment = function(elems, fn, item, doc) {
        var fragment = (doc || document).createDocumentFragment();
        for (var i = 0, el; el = elems[i++];) {
            fn(el, makeFragment(item, fragment, i > 1));
        }
    }
    var makeFragment = function(nodes, fragment, bool) {
        //只有非NodeList的情况下我们才为i递增;
        var ret = fragment.cloneNode(false), go= !nodes.item;
        for(var i = 0, node; node = nodes[i]; go && i++) {
            ret.appendChild(bool && cloneNode(node, true, true) || node);
        }
        return ret;
    }
    /**
     * 实现insertAdjacentHTML的增强版
     * @param {doly}  nodes doly实例
     * @param {String} type 方法名
     * @param {Any}  item 插入内容或替换内容,可以为HTML字符串片断，元素节点，文本节点，文档碎片或doly对象
     * @param {Document}  doc 执行环境所在的文档
     * @return {doly} 返回更改后的nodes
     */
    function manipulate(nodes, type, item, doc) {
        var elems = doly.slice(nodes).filter(function(el) {
            return el.nodeType === 1;//转换为纯净的元素节点数组
        });
        if (item.nodeType) {
            //如果是传入元素节点或文本节点或文档碎片
            insertAdjacentNode(elems, insertApapter[type], item);
        } else if (typeof item === 'string') {
            //如果传入的是字符串片断
            var
            fragment = doly.parseHTML(item, doc),
            //如果方法名不是replace并且完美支持insertAdjacentHTML并且不存在套嵌关系的标签
            fast = (type !== 'replace') && support[adjacent] && !rnest.test(item);
            insertAdjacentHTML(elems, insertApapter[type], fragment, fast, insertApapter[type + '2'], item);
        } else if (item.length) {
            //如果传入的是HTMLCollection nodeList doly实例，将转换为文档碎片
            insertAdjacentFragment(elems, insertApapter[type], item, doc) ;
        }
        return nodes;
    }
    
    var div = document.createElement('div'),//缓存parser，防止反复创建
        unknownTag = '<?XML:NAMESPACE';
    function shimCloneNode(outerHTML, tree) {
        tree.appendChild(div);
        div.innerHTML = outerHTML;
        tree.removeChild(div);
        return div.firstChild;
    }
    
    // 克隆节点 包含时间和数据
    function cloneNode(node, dataAndEvents, deepDataAndEvents) {
        // 处理IE6-8下复制事件时一系列错误
        if (node.nodeType === 1) {
            var bool; // !undefined === true;
            //这个判定必须这么长：判定是否能克隆新标签，判定是否为元素节点, 判定是否为新标签
            if (!support.html5Clone && node.outerHTML) { //延迟创建检测元素
                var outerHTML = document.createElement(node.nodeName).outerHTML;
                bool = outerHTML.indexOf(unknownTag) // !0 === true;
            }
            //各浏览器cloneNode方法的部分实现差异 http://www.cnblogs.com/snandy/archive/2012/05/06/2473936.html
            var neo = !bool ? shimCloneNode(node.outerHTML, document.documentElement) : node.cloneNode(true), src, neos, i;
            if (!support.noCloneEvent) {
                fixNode(neo, node);
                src = node.getElementsByTagName('*');
                neos = neo.getElementsByTagName('*');
                for (i = 0; src[i]; i++) {
                    fixNode(neos[i], src[i]);
                }
            }
            // 复制自定义属性，事件也被当作一种特殊的能活动的数据
            if (dataAndEvents) {
                doly.mergeData(neo, node);
                if (deepDataAndEvents) {
                    src =  node.getElementsByTagName('*');
                    neos = neo.getElementsByTagName('*');
                    for (i = 0; src[i]; i++) {
                        doly.mergeData(neos[i], src[i]);
                    }
                }
            }
            src = neos = null;
            return neo;
        } else {
            return node.cloneNode(true);
        }
    }
    
    //修正IE下对数据克隆时出现的一系列问题
    function fixNode(clone, src) {
        if (src.nodeType == 1) {
            //只处理元素节点
            var nodeName = clone.nodeName.toLowerCase();
            //clearAttributes方法可以清除元素的所有属性值，如style样式，或者class属性，与attachEvent绑定上去的事件
            clone.clearAttributes();
            //复制原对象的属性到克隆体中,但不包含原来的事件, ID,  NAME, uniqueNumber
            clone.mergeAttributes(src, false);
            //IE6-8无法复制其内部的元素
            if (nodeName === 'object') {
                clone.outerHTML = src.outerHTML;
                if (support.html5Clone && (src.innerHTML && !clone.innerHTML.trim())) {
                    clone.innerHTML = src.innerHTML;
                }
            } else if (nodeName === 'input' && (src.type === 'checkbox' || src.type == 'radio')) {
                //IE6-8无法复制chechbox的值，在IE6-7中也defaultChecked属性也遗漏了
                if (src.checked) {
                    clone.defaultChecked = clone.checked = src.checked;
                }
                // 除Chrome外，所有浏览器都会给没有value的checkbox一个默认的value值”on”。
                if (clone.value !== src.value) {
                    clone.value = src.value;
                }
            } else if (nodeName === 'option') {
                clone.selected = src.defaultSelected; // IE6-8 无法保持选中状态
            } else if ( nodeName === 'input' || nodeName === 'textarea') {
                clone.defaultValue = src.defaultValue; // IE6-8 无法保持默认值
            } else if (nodeName === 'script' && clone.text !== src.text) {
                clone.text = src.text; // IE6-8不能复制script的text属性
            }
        }
    }
    
    function outerHTML(el) {
        switch(el.nodeType + '') {
            case '1':
            case '9':
                return 'xml' in el ? el.xml : new XMLSerializer().serializeToString(el);
            case '3':
            case '4':
                return el.nodeValue;
            case '8':
                return '<!--' + el.nodeValue + '-->';
        }
    }
    function innerHTML(el) {
        for (var i = 0, c, ret = []; c = el.childNodes[i++];) {
            ret.push(outerHTML(c));
        }
        return ret.join('');
    }
    
    // 清除ele上的数据
    function clearData(ele) {
        doly.removeData(ele);
        ele.clearAttributes && ele.clearAttributes();
    }
    
    doly.mix(doly, {
        parseHTML: function(html, doc) {
            doc = doc || document;
            html = html.replace(rxhtml, '<$1></$2>').trim();
            //尝试使用createContextualFragment获取更高的效率
            //http://www.cnblogs.com/rubylouvre/archive/2011/04/15/2016800.html
            if (doly.commonRange && doc === document && !rcreate.test(html) && !rnest.test(html)) {
                return doly.commonRange.createContextualFragment(html);
            }
            if (!support.htmlSerialize) {//fix IE
                html = html.replace(rcreate, '<br class="fix_create_all"/>$1');//在link style script等标签之前添加一个补丁
            }
            var 
            tag = (rtagName.exec(html) || ['', ''])[1].toLowerCase(),//取得其标签名
            wrap = translations[tag] || translations._default,
            fragment = doc.createDocumentFragment(),
            wrapper = doc.createElement('div'), firstChild;
            html = wrap[3] ? wrap[3](html) : html
            wrapper.innerHTML = wrap[1] + html + wrap[2];
            var els = wrapper.getElementsByTagName('script');
            if (els.length) {//使用innerHTML生成的script节点不会发出请求与执行text属性
                var script = doc.createElement('script'), neo;
                for (var i = 0, el; el = els[i++];) {
                    if (!el.type || types[el.type]) {//如果script节点的MIME能让其执行脚本
                        neo = script.cloneNode(false);//FF不能省略参数
                        for (var j = 0, attr; attr = el.attributes[j++];) {
                            if(attr.specified){//复制其属性
                                neo[attr.name] = [attr.value];
                            }
                        }
                        neo.text = el.text;//必须指定,因为无法在attributes中遍历出来
                        el.parentNode.replaceChild(neo, el);//替换节点
                    }
                }
            }
            //移除我们为了符合套嵌关系而添加的标签
            for (i = wrap[0]; i--; wrapper = wrapper.lastChild) {};
            //在IE6中,当我们在处理colgroup, thead, tfoot, table时会发生成一个tbody标签
            if (!support.tbody) {
                var noTbody = !rtbody.test(html); //矛:html本身就不存在<tbody字样
                els = wrapper.getElementsByTagName( "tbody" );
                if ( els.length > 0 && noTbody ){//盾：实际上生成的NodeList中存在tbody节点
                    for ( i = 0; el = els[ i++ ]; ) {
                        if(!el.childNodes.length )//如果是自动插入的里面肯定没有内容
                            el.parentNode.removeChild( el );
                    }
                }
            }
            if (!support.htmlSerialize) {//移除所有补丁
                for (els = wrapper.getElementsByTagName('br'), i = 0; el = els[i++];) {
                    if (el.className && el.className === 'fix_create_all') {
                        el.parentNode.removeChild(el);
                    }
                }
            }
            if (!support.appendChecked) {//IE67没有为它们添加defaultChecked
                for (els = wrapper.getElementsByTagName('input'), i = 0; el = els[ i++ ];) {
                    if (el.type === 'checkbox' || el.type === 'radio') {
                        el.defaultChecked = el.checked;
                    }
                }
            }
            while(firstChild = wrapper.firstChild) { // 将wrapper上的节点转移到文档碎片上！
                fragment.appendChild(firstChild);
            }
            return fragment;
        },
        
        // 用于统一配置多态方法的读写访问
        access: function(elems, key, value, getter, setter, scope) {
            var length = elems.length, k, i;
            setter = typeof setter === 'function' ? setter : getter;
            scope = arguments[arguments.length - 1];
            if (typeof key === 'object') {
                for (k in key) { // 设置所有的元素设置属性
                    for (i = 0; i < length; i++) {
                        setter.call(scope, elems[i], k, key[k]);
                    }
                }
                return elems;
            }
            if (value !== void 0) {
                for (i = 0; i < length; i++) {
                    setter.call(scope, elems[i], key, value);
                }
                return elems;
            } //取得第一个元素的属性, getter的参数总是少于setter
            return length ? getter.call(scope, elems[0], key) : void 0;
        },
        
        // 清除elems数据
        cleanData: function(elems) {
            var len = elems.length, i = 0, ele;
            if (!len) return;
            for (; (ele = elems[i++]) != null; ) {
                if (ele.nodeType === 1) clearData(ele);
            }
        },
        
        filterEle: function(expr, elems, not) {
            if (not) {
                expr = ':not(' + expr + ')';
            }
            return elems.length === 1 ?
                doly.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] :
                doly.find.matches(expr, elems);
        }
    });
    var dolyPt = doly.prototype;
    doly.mix(dolyPt, node);
    doly.mix(dolyPt, { // 实现data和removeData
        data: function(key, item, pv) {
            init.call(this);
            return doly.access(this, key, item, function(el){
                return doly.data(el, key, item,  pv === true);
            });
        },
        removeData: function(key, pv) {
            init.call(this);
            return this.each(function() {
                doly.removeData(this, key, pv);
            });
        }
    });
    'push,unshift,pop,shift,splice,sort,reverse'.replace(doly.rword, function(method) {
        var Ap = Array.prototype;
        dolyPt[method + 'Ele'] = function() {
            init.call(this);
            Ap[method].apply(this, arguments);
            return this;
        }
    });
    'append,prepend,before,after,replace'.replace(doly.rword, function(method) {
        dolyPt[method] = function(item) {
            init.call(this);
            return manipulate(this, method, item, this.ownerDocument);
        }
        dolyPt[method + 'To'] = function(item) {
            var tmp = doly(item, this.ownerDocument);
            init.call(tmp);
            tmp[method](this);
            return this;
        }
    });
    
    var uniqOne = doly.oneObject(['children', 'contents', 'next', 'prev']);
    function travel(el, prop, expr) {
        var result = [], i = 0;
        while ((el = el[prop])) {
            if (el && el.nodeType === 1) {
                result[i++] = el;
                if (expr === true) {
                    break;
                } else if (typeof expr === 'string' && doly.matchesSelector(el, expr)) { // until
                    result.pop();
                    break;
                }
            }
        }
        return result;
    };
    
    doly.each({
        parent: function(el) {
            var parent = el.parentNode;
            return parent && parent.nodeType !== 11 ? parent: [];
        },
        parents: function(el) {
            return travel(el, 'parentNode').reverse();
        },
        parentsUntil: function(el ,expr) {
            return travel(el, 'parentNode', expr).reverse();
        },
        next: function(el) {
            return travel(el, 'nextSibling', true);
        },
        nextAll: function(el) {
            return travel(el, 'nextSibling');
        },
        nextUntil: function(el, expr) {
            return travel(el, 'nextSibling', expr);
        },
        prev: function(el) {
            return travel(el, 'previousSibling', true);
        },
        prevAll: function(el) {
            return travel(el, 'previousSibling').reverse();
        },
        prevUntil: function(el, expr) {
            return travel(el, 'previousSibling', expr).reverse();
        },
        children: function(el) {
            return el.children ? doly.slice(el.children) :
            doly.slice(el.childNodes).filter(function(node) {
                return node.nodeType === 1;
            });
        },
        siblings: function(el) {
            return travel(el, 'previousSibling').reverse().concat(travel(el, 'nextSibling'));
        },
        contents: function(el) {
            return el.tagName === 'IFRAME' ?
            el.contentDocument || el.contentWindow.document :
            doly.slice(el.childNodes);
        }
    }, function(method, name) {
        dolyPt[name] = function(until, selector) {
            init.call(this);
            var nodes = [], i = 0, el;
            for ( ; el = this[i++]; ) {
                nodes = nodes.concat(method(el, until));
            }
            if (!/Until/.test(name)) {
                selector = until;
            }
            if (selector && typeof selector === 'string') {
                nodes = doly.filterEle(selector, nodes);
            }
            nodes = this.length > 1 && !uniqOne[name] ? doly.unique(nodes) : nodes;
            return this.pushStack(nodes);
        };
    });
    
    return node;
});