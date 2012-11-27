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
			if (doly.isArray(elems)) {
				push.apply(ret, elems);
			} else {
				doly.merge(ret, elems);
			}
			ret.prevObject = this;
			ret.context = this.context;
			ret.ownerDocument = this.ownerDocument;
			if (name === 'find') {
				ret.selector = this.selector + (this.selector ? ' ' : '') + selector;
			} else if (name) {
				ret.selector = this.selector + '.' + name + '(' + selector + ')';
			}
			//ret._wrapped = ret;
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
						if (doly.eleContains(self[i], value)) {
							return true;
						}
					}
				}));
			}
			ret = [];
			for (i = 0, len = this.length; i < len; i++) {
				doly.find(expr, this[i], ret);
			}
			ret = this.pushStack(doly.unique(ret));
			ret.selector = (this.selector ? this.selector + ' ' : '' ) + expr;
			return ret;
		},
		
		
		
		empty: function(elems) {
		    init.call(this);
			
			return this;
		},
		
		text: function(elems, item) {
		    init.call(this);
			return doly.access(elems, 0, item, function(el) {
			    if (!el) {
                    return '';
                } else if (el.tagName == 'OPTION' || el.tagName == 'SCRIPT') {
                    return el.text;
                }
                return el.textContent || el.innerText || doly.getText([el]);
			}, function() {
			    
			}, elems);
		}
		
	};
	
	var rtag = /^[a-zA-Z]+$/;
	
	function init() {
		if (this.__hasInit__) return;
		var expr = this._wrapped, _wrapped, doc, context, nodes; //用作节点搜索的起点
	    this.__hasInit__ = true;
		if (!expr) {
			this.length = 0;
			this._wrapped = [];
			return this;
		}
		
		if (doly.isArray(expr) && expr.__selector__) { // 处理参数
		    context = expr[1] || document;
			expr = expr[0];
		}
		if (expr.nodeType) {
			this.context = this[0] = expr;
			this.length = 1;
			this._wrapped = [expr];
			return this;
		}
		if (doly.isArrayLike(context)) {
		    this.ownerDocument  = expr.nodeType === 9 ? expr : expr.ownerDocument;
			return doly(context).find(expr);
		}
		this.selector = expr + '';
		if (typeof expr === 'string') {
			doc = this.ownerDocument = !context ? document : getDoc( context, context[0] );
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
		} else {//分支8：处理数组，节点集合或者mass对象或window对象
			this.ownerDocument = getDoc(expr[0]);
			_wrapped = this._wrapped = doly.isArrayLike(expr) ?  expr : [expr];
			this.length || (this.length = 0);
			doly.merge(this, _wrapped);
			delete this.selector;
		}
		
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
    rnest = /<(?:td|th|tf|tr|col|opt|leg|cap|area)/;
	
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
                for(k in key) { // 设置所有的元素设置属性
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
		}
	});
	
	doly.mix(doly.prototype, node);
	return node;
});