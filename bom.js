/**
 * module bom
 */

define('bom', function() {
    'use strict';
    
    var bom = {
        // cookie操作
        cookie: {
            get: function(name) {
                var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)', 'gi'),
                    tmp;
                if (tmp = reg.exec(decodeURIComponent(document.cookie)))
                    return tmp[2];
                return null;
            },
            
            set: function(name, value, expires, path, domain, secure) {
                var cookieText = encodeURIComponent(name) + '=' +
                                 encodeURIComponent(value);
                if (doly.type(expires, 'Date')) {
                    cookieText += '; expires=' + expires.toGMTString();
                } else if (expires == 'never') {
				    expires = new Date();
					expires.setTime(expires.getTime() + 100 * 365 * 24 * 60 * 60 * 1000);
					cookieText += '; expires=' + expires.toGMTString();
				} else if (doly.type(expires, 'Number')) {
				    var exp = new Date();
                    exp.setTime(exp.getTime() + expires * 60 * 1000);
					cookieText += '; expires=' + exp.toGMTString();
				}
                if (path) {
                    cookieText += '; path=' + path;
                }
                if (domain) {
                    cookieText += '; domain=' + domain;
                }
                if (secure) {
                    cookieText += '; secure';
                }
                document.cookie = cookieText;
            },
            
            remove: function(name, path, domain, secure) {
                doly.cookie.set(name, '', new Date(0), path, domain, secure);
            }
        },
        
        // 浏览器信息
        client: function() {
            var self = arguments.callee;
            if (self._info) {
                return self._info;
            }
            //rendering engines
            var engine = {            
                ie: 0,
                gecko: 0,
                webkit: 0,
                khtml: 0,
                opera: 0,

                //complete version
                ver: null  
            };
            
            //browsers
            var browser = {
                
                //browsers
                ie: 0,
                firefox: 0,
                safari: 0,
                konq: 0,
                opera: 0,
                chrome: 0,

                //specific version
                ver: null
            };

            
            //platform/device/OS
            var system = {
                win: false,
                mac: false,
                x11: false,
                
                //mobile devices
                iphone: false,
                ipod: false,
                ipad: false,
                ios: false,
                android: false,
                nokiaN: false,
                winMobile: false,
                
                //game systems
                wii: false,
                ps: false 
            };
            
            var name = {
                qq: 0,
                maxthon: 0,
                sogou: 0,
                ie: 0,
                chrome: 0,
                uc: 0,
                safari: 0,
                firefox: 0,
                opera: 0,
                
                unknown: 0
            };

            //detect rendering engines/browsers
            var ua = navigator.userAgent, ret;    
            if (window.opera) {
                engine.ver = browser.ver = window.opera.version();
                engine.opera = browser.opera = parseFloat(engine.ver);
            } else if (/AppleWebKit\/(\S+)/.test(ua)) {
                engine.ver = RegExp['$1'];
                engine.webkit = parseFloat(engine.ver);
                
                //figure out if it's Chrome or Safari
                if (/Chrome\/(\S+)/.test(ua)) {
                    browser.ver = RegExp['$1'];
                    browser.chrome = parseFloat(browser.ver);
                } else if (/Version\/(\S+)/.test(ua)) {
                    browser.ver = RegExp['$1'];
                    browser.safari = parseFloat(browser.ver);
                } else {
                    //approximate version
                    var safariVersion = 1;
                    if (engine.webkit < 100){
                        safariVersion = 1;
                    } else if (engine.webkit < 312){
                        safariVersion = 1.2;
                    } else if (engine.webkit < 412){
                        safariVersion = 1.3;
                    } else {
                        safariVersion = 2;
                    }   
                    
                    browser.safari = browser.ver = safariVersion;        
                }
            } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
                engine.ver = browser.ver = RegExp['$1'];
                engine.khtml = browser.konq = parseFloat(engine.ver);
            } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {    
                engine.ver = RegExp['$1'];
                engine.gecko = parseFloat(engine.ver);
                
                //determine if it's Firefox
                if (/Firefox\/(\S+)/.test(ua)) {
                    browser.ver = RegExp['$1'];
                    browser.firefox = parseFloat(browser.ver);
                }
            } else if (/MSIE ([^;]+)/.test(ua)) {    
                engine.ver = browser.ver = RegExp['$1'];
                engine.ie = browser.ie = parseFloat(engine.ver);
            }
            
            //detect browsers
            browser.ie = engine.ie;
            browser.opera = engine.opera;

            //detect platform
            var p = navigator.platform;
            system.win = p.indexOf('Win') == 0;
            system.mac = p.indexOf('Mac') == 0;
            system.x11 = (p == 'X11') || (p.indexOf('Linux') == 0);

            //detect windows operating systems
            if (system.win) {
                if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
                    if (RegExp['$1'] == 'NT') {
                        switch(RegExp['$2']) {
                            case '5.0':
                                system.win = '2000';
                                break;
                            case '5.1':
                                system.win = 'XP';
                                break;
                            case '6.0':
                                system.win = 'Vista';
                                break;
                            case '6.1':
                                system.win = '7';
                                break;
                            default:
                                system.win = 'NT';
                                break;                
                        }                            
                    } else if (RegExp['$1'] == '9x') {
                        system.win = 'ME';
                    } else {
                        system.win = RegExp['$1'];
                    }
                }
            }
            
            //mobile devices
            system.iphone = ua.indexOf('iPhone') > -1;
            system.ipod = ua.indexOf('iPod') > -1;
            system.ipad = ua.indexOf('iPad') > -1;
            system.nokiaN = ua.indexOf('NokiaN') > -1;
            
            //windows mobile
            if (system.win == 'CE') {
                system.winMobile = system.win;
            } else if (system.win == 'Ph') {
                if(/Windows Phone OS (\d+.\d+)/.test(ua)) {;
                    system.win = 'Phone';
                    system.winMobile = parseFloat(RegExp['$1']);
                }
            }
            
            
            //determine iOS version
            if (system.mac && ua.indexOf('Mobile') > -1) {
                if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
                    system.ios = parseFloat(RegExp.$1.replace('_', '.'));
                } else {
                    system.ios = 2;  //can't really detect - so guess
                }
            }
            
            //determine Android version
            if (/Android (\d+\.\d+)/.test(ua)) {
                system.android = parseFloat(RegExp.$1);
            }
            
            //gaming systems
            system.wii = ua.indexOf('Wii') > -1;
            system.ps = /playstation/i.test(ua);
            
            name.opera = browser.opera;
            name.firefox = browser.firefox;
            engine.ie ?
                ua.indexOf('QQBrowser') != -1 ? name.qq = 1 :
                ua.indexOf('Maxthon') != -1 ? name.maxthon = 1 :
                (ua.indexOf('SE') != -1 && ua.indexOf('MetaSr') != -1) ? name.sogou = 1 :
                name.ie = engine.ie :
            engine.webkit ?
                browser.chrome ? name.chrome = browser.chrome :
                ua.indexOf('QQBrowser') != -1 ? name.qq = 1 :
                ua.indexOf('UC') != -1 ? name.uc = 1 :
                ua.indexOf('Maxthon') != -1 ? name.maxthon = 1 :
                (ua.indexOf('SE') != -1 && ua.indexOf('MetaSr') != -1) ? name.sogou = 1 :
                browser.safari ? name.safari = browser.safari :
                name.unknown = 1 :
            '';
            // if (engine.ie) {
                // ua.indexOf('QQBrowser') != -1
                // if (ua.indexOf('QQBrowser') != -1) {
                    // name.qq = 1;
                // } else if (ua.indexOf('Maxthon') != -1) {
                    // name.maxthon = 1;
                // } else if (ua.indexOf('SE') != -1 && ua.indexOf('MetaSr') != -1) {
                    // name.sogou = 1;
                // } else {
                    // name.ie = engine.ie;
                // }
            // }
            // if (engine.webkit) {
                // if (ua.indexOf('Chrome') != -1) {
                    // name.chrome = 1;
                // } else if (ua.indexOf('QQBrowser') != -1) {
                    // name.qq = 1;
                // } else if (ua.indexOf('UC') != -1) {
                    // name.uc = 1;
                // } else if (ua.indexOf('Maxthon') != -1) {
                    // name.maxthon = 1;
                // } else if (ua.indexOf('SE') != -1 && ua.indexOf('MetaSr') != -1) {
                    // name.sogou = 1;
                // } else if (ua.indexOf('Version') != -1 && ua.indexOf('Safari') != -1) {
                    // name.safari = 1;
                // } else {
                    // name.unknown = 1;
                // }
            // }
            
            ret = {
                engine:     engine,
                browser:    browser,
                system:     system,
                name:       name                
            };
            self._info = ret;
            return ret;
        }
    };
    
    doly.mix(doly, bom);
    return bom;
});