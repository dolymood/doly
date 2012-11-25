/**
 * module ready
 */

define('ready', function() {
    'use strict';
    
    var readyList = [],
        HTML = doly.HTML,
        isReady = false,
        DOMContentLoaded = function() {
            if (document.addEventListener) {
                document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
                fireReady();
            } else if (document.readyState === 'complete') {
                document.detachEvent('onreadystatechange', DOMContentLoaded);
                fireReady();
            }
        };
    
    /*<ltIE8>*/
    // doScroll technique by Diego Perini http://javascript.nwbox.com/IEContentLoaded/
    // testElement.doScroll() throws when the DOM is not ready, only in the top window
    function doScrollCheck() {
        if (!isReady) {
            try {
                HTML.doScroll('left');
                fireReady();
            } catch(e) {
                setTimeout(doScrollCheck, 30);
            }
        }
    };
    // 触发ready，执行绑定的所有ready函数
    function fireReady() {
        if (isReady) return;
        isReady = true;
        if(readyList) {
            var i = 0, readyFn;                     
            while(readyFn = readyList[i++]) {
                readyFn.call(window);
            }
            readyList = undefined;
        }
    }
    // 如果已经是complete状态了
    if (document.readyState === 'complete') {
        fireReady();
    } else if (document.addEventListener) { // W3C 标准
        document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
        window.addEventListener('load', fireReady, false);
    } else { // old IE
        document.attachEvent('onreadystatechange', DOMContentLoaded);
        window.attachEvent('onload', fireReady);
        // 支持doScroll 并且不是在iframe中
        if (HTML.doScroll && self.eval === parent.eval) {
            doScrollCheck();
        }
    }
    doly.ready = function(func) {
        if (isReady) func.call(window);
        readyList.push(func);
    }
    doly.prototype.ready = function(elem, func) {
        doly.ready(func);
    };
    return doly.ready;
});