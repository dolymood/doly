/**
 * module promise
 */

define('promise', ['$class'], function() {
    'use strict';
	
	var promiseCache = {},
	    PENDING = 1,
		RESOLVED = 2,
		REJECTED = 3,
		Promise;
	
	doly.when = function() {
	    return new Promise(doly.slice(arguments));
	};
	doly.defer = function() {
	    return new Promise();
	};
	
	Promise = doly.factory({
	    
		init: function(list) {
		    var uid = doly.getUID(this),
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
				ps.uid = uid;
				if (ps._promise) {
				    ps._promise.uid = uid;
				}
			});
			obj.list = list;
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
				resolveArgs = data.resolveArgs;
				resolveArgs || (resolveArgs = data.resolveArgs = []);
				list = data.list;
				list.forEach(function(ps, i) {
				    if (ps.state !== RESOLVED) {
						isAllResolved = false;
					}
					if (ps === this) {
					    resolveArgs[i] = arg;
					}
				}, this);
				resolves = data.resolves;
				if (isAllResolved && resolves) {
				    resolves.forEach(function(rs) {
					    rs.apply(null, resolveArgs);
					});
				}
			} else {
			    doly.error('promise.resolve error: not initialized');
			}
		},
		
		// 已拒绝
		reject: function(arg) {
		    var data = promiseCache[this.uid],
			    isRejected = false,
				list, rejectArgs, rejects;
			if (data) {
			    list = data.list;
				rejectArgs = data.rejectArgs;
				rejectArgs || (rejectArgs = data.rejectArgs = []);
				list.forEach(function(ps, i) {
				    if (ps.state === REJECTED) {
					    isRejected = true;
					} else {
					    ps.state = REJECTED;
					}
					if (ps === this) {
					    rejectArgs[i] = arg;
					}
				}, this);
				rejects = data.rejects;
				if (!isRejected && rejects) {
				    rejects.forEach(function(rj) {
					    rj.apply(null, rejectArgs);
					});
				}
			} else {
			    doly.error('promise.reject error: not initialized');
			}
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
			} else {
			    doly.error('promise.then error: not initialized');
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
			} else {
			    doly.error('promise.done error: not initialized');
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
			} else {
			    doly.error('promise.fail error: not initialized');
			}
			return this;
		},
		
		promise: function() {
		    var self = this, ret;
			ret = {
			    then: function(resolvedHandler, rejectedHandler) {
				    self.then(resolvedHandler, rejectedHandler);
					return this;
				},
				
				done: function(resolvedHandler) {
				    self.done(resolvedHandler);
					return this;
				},
				
				fail: function(rejectedHandler) {
				    self.fail(rejectedHandler);
					return this;
				},
				
				state: self.state,
				
				destory: function() {
				    this.each(function(val, key, cache) {
					    cache[key] = null;
				        delete cache[key];
					});
					self.destory();
					this = null;
				},
				
				uid: self.uid
			};
			this._promise = ret;
			return this._promise;
		},
		
		// 手动销毁
		destory: function() {
		    var uid = this.uid,
			    cache = promiseCache[uid];
			cache.each(function(val, key, cache) {
			    cache[key] = null;
				delete cache[key];
			});
			promiseCache[uid] = null;
			delete promiseCache[uid];
		}
		
	});
	
	return Promise;
});