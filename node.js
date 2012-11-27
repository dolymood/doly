/**
 * module node
 */

define('node', ['$support', '$data', '$query'], function(support) {
    'use strict';
	
	var node = {
	    
		find: function(expr) {
		    init.call(this, expr);
			
			return this;
		},
		
		
		
		empty: function(elems) {
		    init.call(this, elems);
			
			return this;
		},
		
		text: function(elems, item) {
		    init.call(this, elems);
			return doly.access(elems, 0, item, function(el) {
			    if (!el) {
                    return '';
                } else if (el.tagName == 'OPTION' || el.tagName == 'SCRIPT') {
                    return el.text;
                }
                return el.textContent || el.innerText || doly.getText([el]);
			}, function() {
			    
			}, elems);
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
		
	}, _innerCache = {};
	
	function init(expr) {
		this.length = 0;
		if (!expr) {
			return [];
		}
		
		var doc, context, nodes; //用作节点搜索的起点
		if (doly.isArray(expr) && expr.__selector__) { // 处理参数
		    context = expr[1] || document;
			expr = expr[0];
		}
		if (expr.nodeType) {
			this.context = this[0] = expr;
			this.length = 1;
			return (this._wrapped = this);
		}
		if (doly.isArrayLike(context)) {
		    this.ownerDocument  = expr.nodeType === 9 ? expr : expr.ownerDocument;
			return doly(context).find(expr);
		}
		if (typeof expr === 'string') {
			doc = this.ownerDocument = !context ? document : getDoc( context, context[0] );
			var scope = context || doc;
			if (expr.charAt(0) === '<' && expr.charAt(expr.length - 1) === '>' && expr.length >= 3) {
				nodes = doly.parseHTML( expr, doc );//分支5: 动态生成新节点
				nodes = nodes.childNodes
			} else if( rtag.test( expr ) ){//分支6: getElementsByTagName
				nodes  = scope[ TAGS ]( expr ) ;
			} else{//分支7：进入选择器模块
				nodes  = $.query( expr, scope );
			}
			return (this._wrapped = doly.merge(this, $.slice(nodes)));
		}else {//分支8：处理数组，节点集合或者mass对象或window对象
			this.ownerDocument = getDoc( expr[0] );
			this._wrapped = doly.merge( this, $.isArrayLike(expr) ?  expr : [ expr ]);
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
	
	doly.mix(doly.prototype, node);
	return node;
});