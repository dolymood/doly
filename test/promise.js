$(function() {
	module('promise');
	
	asyncTest('promise', function() {
		
		_$.require(['$promise'], function() {
			var fuc1 = function() {
			    var df = doly.defer();
				setTimeout(function() {
				    df.resolve('resolved1');
				}, 1000);
				return df.promise();
			};
			var fuc2 = function() {
			    var df = doly.defer();
				setTimeout(function() {
				    df.reject('reject2');
				}, 4000);
				return df.promise();
			};
			var fuc3 = function() {
			    var df = doly.defer();
				setTimeout(function() {
				    df.resolve('resolved3');
				}, 8000);
				return df.promise();
			};
			var fuc4 = function() {
			    var df = doly.defer();
				setTimeout(function() {
				    df.reject('reject4');
				}, 12000);
				return df.promise();
			};
			fuc1().done(function(ret) {
			    doly.log('fuc1:' + ret);
			}).fail(function(msg) {
			    doly.log('fuc1:fail:' + msg);
			});
			fuc2().done(function(ret) {
			    doly.log('fuc2:' + ret);
			}).fail(function(msg) {
			    doly.log('fuc2:fail:' + msg);
			});
			fuc3().done(function(ret) {
			    doly.log('fuc3:' + ret);
			}).fail(function(msg) {
			    doly.log('fuc3:fail:' + msg);
			});
			fuc4().then(function(ret) {
			    doly.log('fuc4:' + ret);
			}, function(msg) {
			    doly.log('fuc4:fail:' + msg);
			});
			doly.when(fuc1(), fuc3()).done(function(r1, r3) {
			    doly.log('fuc1+fuc3:' + r1 + '+' + r3);
			}).fail(function(r1, r2) {
			    doly.log('fuc1+fuc3:fail:' + r1 + '+' + r2);
			});
			doly.when(fuc2(), fuc4()).done(function(r1, r3) {
			    doly.log('fuc2+fuc4:' + r1 + '+' + r3);
			}).fail(function(r1, r2) {
			    doly.log('fuc2+fuc4:fail:' + r1 + '+' + r2);
			});
			doly.when(fuc1(), fuc2()).then(function(r1, r3) {
			    doly.log('fuc1+fuc2:' + r1 + '+' + r3);
			}, function(r1, r2) {
			    doly.log('fuc1+fuc2:fail:' + r1 + '+' + r2);
			});
			doly.when(fuc3(), fuc4()).then(function(r1, r3) {
			    doly.log('fuc3+fuc4:' + r1 + '+' + r3);
			}, function(r1, r2) {
			    doly.log('fuc3+fuc4:fail:' + r1 + '+' + r2);
			});
			var d1 = fuc1();
			var d2 = fuc2();
			var d3 = fuc3();
			var d4 = fuc4();
			doly.when(d1, d3).then(function(r1, r2) {
			    doly.log('d1, d2:' + r1 + '+' + r2);
			}, function(r1, r2) {
			    doly.log('d1, d2:fail:' + r1 + '+' + r2);
			});
			doly.when(d1, d2, d3, d4).then(function(r1, r2, r3, r4) {
			    doly.log('d1, d2, d3, d4:' + r1 + '+' + r2 + '+' + r3 + '+' + r4);
			}, function(r1, r2, r3, r4) {
			    doly.log('d1, d2, d3, d4:fail:' + r1 + '+' + r2 + '+' + r3 + '+' + r4);
			});
			ok(1);
			start();
		});
	});
});