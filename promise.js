/**
 * module promise
 */

define('promise', ['$class'], function(doly) {
    'use strict';
    
    var promiseCache = {},
        PENDING = 1,
        RESOLVED = 2,
        REJECTED = 3,
        each = doly.each,
        // https://github.com/broofa/node-uuid
        _rnds = new Array(16),
        _rng = function() {
            for (var i = 0, r; i < 16; i++) {
                if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
                _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
            }
            return _rnds;
        },
        _byteToHex = (function() {
            var ret = [];
            for (var i = 0; i < 256; i++) {
                ret[i] = (i + 0x100).toString(16).substr(1);
            }
            return ret;
        })(),
        uuid = function() {
            var i = 0,
                rnds = _rng(),
                bth = _byteToHex;
            rnds[6] = (rnds[6] & 0x0f) | 0x40;
            rnds[8] = (rnds[8] & 0x3f) | 0x80;
            return bth[rnds[i++]] + bth[rnds[i++]] +
                bth[rnds[i++]] + bth[rnds[i++]] + '-' +
                bth[rnds[i++]] + bth[rnds[i++]] + '-' +
                bth[rnds[i++]] + bth[rnds[i++]] + '-' +
                bth[rnds[i++]] + bth[rnds[i++]] + '-' +
                bth[rnds[i++]] + bth[rnds[i++]] +
                bth[rnds[i++]] + bth[rnds[i++]] +
                bth[rnds[i++]] + bth[rnds[i++]];
        },
        Promise;

    doly.when = function() {
        return new doly.Promise(doly.slice(arguments));
    };
    doly.defer = function() {
        return new doly.Promise();
    };
    
    doly.Promise = doly.factory({
        
        init: function(list) {
            var uid = uuid(),
                obj = promiseCache[uid] = {};
            list || (list = [this]);
            list.forEach(function(ps, i, list) {
                var tmpUid = ps.uid,
                    data;
                if (tmpUid) {
                    data = promiseCache[tmpUid];
                    if ('resolveArgs' in data) {
                        obj.resolveArgs = [];
                        obj.resolveArgs[i] = data.resolveArgs[0];
                    }
                    if ('rejectArgs' in data) {
                        obj.rejectArgs = [];
                        obj.rejectArgs[i] = data.rejectArgs[0];
                    }
                }
                // 给list的每一个promise对象的references属性
                // 增加当前的promise对象，这样以后list中的每
                // 一个promise对象状态更改的时候通过references
                // 检查当前promise对象是否可以执行回调函数
                if (ps !== this) {
                    ps.references.push(this);
                }
            }, this);
            obj.list = list; // 当前promise对象所依赖的promise列表
            // 所有的使用当前promise对象的promise对象uid集合
            this.references = [];
            this.uid = uid;
            this.state = PENDING;
        },
        
        // 已完成
        resolve: function(arg) {
            var data = promiseCache[this.uid],
                isAllResolved = true,
                list, resolveArgs, resolves;
            if (data) {
                this.state = RESOLVED;
                this.resolveArg = arg;
                resolveArgs = data.resolveArgs;
                resolveArgs || (resolveArgs = data.resolveArgs = []);
                list = data.list;
                list.forEach(function(ps, i) {
                    if (ps.state !== RESOLVED) {
                        isAllResolved = false;
                    }
                    resolveArgs[i] = ps.resolveArg;
                }, this);
                resolves = data.resolves;
                if (isAllResolved && resolves) {
                    resolves.forEach(function(rs) {
                        rs.apply(null, resolveArgs);
                    });
                    each(data, function(val, key) {
                        this[key] = val = null;
                        delete this[key];
                    }, data);
                    delete promiseCache[this.uid];
                }
            }
            this.references.forEach(function(ps) {
                ps.resolve(ps.resolveArg);
            });
        },
        
        // 已拒绝
        reject: function(arg) {
            var data = promiseCache[this.uid],
                isRejected = false,
                list, rejectArgs, rejects;
            // 确保只执行一次的失败处理函数
            if (this.isRejected) return false;
            if (data) {
                list = data.list;
                this.rejectArg = arg;
                rejectArgs = data.rejectArgs;
                rejectArgs || (rejectArgs = data.rejectArgs = []);
                list.forEach(function(ps, i) {
                    if (ps.state === REJECTED) {
                        isRejected = true;
                    }
                    rejectArgs[i] = ps.rejectArg;
                    if (ps === this) {
                        this.state = REJECTED;
                    }
                }, this);
                rejects = data.rejects;
                // 确保失败回调执行 并且只执行一次
                if ((!isRejected || !this.isRejected) && rejects) {
                    rejects.forEach(function(rj) {
                        rj.apply(window, rejectArgs);
                    });
                    each(data, function(val, key) {
                        this[key] = val = null;
                        delete this[key];
                    }, data);
                    delete promiseCache[this.uid];
                    this.isRejected = true; // 已经执行过已拒绝的处理函数
                }
            }
            this.references.forEach(function(ps) {
                ps.reject(ps.rejectArg);
            });
        },
        
        // 添加已完成和已拒绝的回调函数
        then: function(resolvedHandler, rejectedHandler) {
            var data = promiseCache[this.uid],
                isAllResolved = true,
                isRejected = false,
                list;
            if (data) {
                list = data.list;
                list.forEach(function(lt) {
                    var state = lt.state;
                    if (state !== RESOLVED) {
                        isAllResolved = false;
                    }
                    if (state === REJECTED) {
                        isRejected = true;
                    }
                });
                if (resolvedHandler) {
                    if (isAllResolved) {
                        resolvedHandler.apply(null, data.resolveArgs);
                    } else {
                        data.resolves || (data.resolves = []);
                        data.resolves.push(resolvedHandler);
                    }
                }
                if (rejectedHandler) {
                    if (isRejected) {
                        rejectedHandler.apply(null, data.rejectArgs);
                    } else {
                        data.rejects || (data.rejects = []);
                        data.rejects.push(rejectedHandler);
                    }
                }
            }
            return this;
            // this.done(resolvedHandler);
            // this.fail(rejectedHandler);
        },
        
        // 添加已完成的回调函数
        done: function(resolvedHandler) {
            var data = promiseCache[this.uid],
                isAllResolved = true,
                list;
            if (data) {
                list = data.list;
                list.forEach(function(lt) {
                    if (lt.state !== RESOLVED) {
                        isAllResolved = false;
                    }
                });
                if (resolvedHandler) {
                    if (isAllResolved) {
                        resolvedHandler.apply(null, data.resolveArgs);
                    } else {
                        data.resolves || (data.resolves = []);
                        data.resolves.push(resolvedHandler);
                    }
                }
            }
            return this;
        },
        
        // 添加已拒绝的回调函数
        fail: function(rejectedHandler) {
            var data = promiseCache[this.uid],
                isRejected = false,
                list;
            if (data) {
                list = data.list;
                list.forEach(function(lt) {
                    if (lt.state === REJECTED) {
                        isRejected = true;
                    }
                });
                if (rejectedHandler) {
                    if (isRejected) {
                        rejectedHandler.apply(null, data.rejectArgs);
                    } else {
                        data.rejects || (data.rejects = []);
                        data.rejects.push(rejectedHandler);
                    }
                }
            }
            return this;
        }
    });

    return doly;
});