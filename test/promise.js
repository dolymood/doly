$(function() {
	module('promise');
	
	asyncTest('promise', function() {
		
		_$.require(['$promise'], function() {
			var fuc1 = function() {
			    var df = doly.defer();
				setTimeout(function() {
				    df.resolve('resolved1');
				}, 1000);
				return df;
			};
			var fuc2 = function() {
			    var df = doly.defer();
				setTimeout(function() {
				    df.reject('reject2');
				}, 2000);
				return df;
			};
			var fuc3 = function() {
			    var df = doly.defer();
				setTimeout(function() {
				    df.resolve('resolved3');
				}, 3000);
				return df;
			};
			var fuc4 = function() {
			    var df = doly.defer();
				setTimeout(function() {
				    df.reject('reject4');
				}, 4000);
				return df;
			};
			var fuc5 = function() {
			    var df = doly.defer();
				df.resolve('resolved5');
				return df;
			};
			var fuc6 = function() {
			    var df = doly.defer();
				df.reject('reject6');
				return df;
			};
			fuc1().done(function(ret) {
			    doly.log('1');
				equal('fuc1:' + ret, 'fuc1:resolved1');
			}).fail(function(msg) {
			    //equal('fuc1:fail:' + msg);
			});
			fuc2().done(function(ret) {
			    //equal('fuc2:' + ret);
			}).fail(function(msg) {
			    doly.log('2');
			    equal('fuc2:fail:' + msg, 'fuc2:fail:reject2');
			});
			fuc3().done(function(ret) {
			    doly.log('3');
				equal('fuc3:' + ret, 'fuc3:resolved3');
			}).fail(function(msg) {
			    //equal('fuc3:fail:' + msg);
			});
			fuc4().then(function(ret) {
			    //equal('fuc4:' + ret);
			}, function(msg) {
			    doly.log('4');
				equal('fuc4:fail:' + msg, 'fuc4:fail:reject4');
			});
			fuc5().done(function(s1) {
			    doly.log('5');
				equal('fuc5:' + s1, 'fuc5:resolved5');
			});
			fuc6().fail(function(s1) {
			    doly.log('6');
				equal('fuc6:fail:' + s1, 'fuc6:fail:reject6');
			});
			doly.when(fuc1(), fuc3()).done(function(r1, r3) {
			    doly.log('7');
			    equal('fuc1+fuc3:' + r1 + '+' + r3, 'fuc1+fuc3:resolved1+resolved3');
			}).fail(function(r1, r2) {
			    //equal('fuc1+fuc3:fail:' + r1 + '+' + r2);
			});
			doly.when(fuc2(), fuc4()).done(function(r1, r3) {
			   // equal('fuc2+fuc4:' + r1 + '+' + r3);
			}).fail(function(r1, r2) {
			    doly.log('8');
				equal('fuc2+fuc4:fail:' + r1 + '+' + r2, 'fuc2+fuc4:fail:reject2+undefined');
			});
			doly.when(fuc1(), fuc2()).then(function(r1, r3) {
			    //equal('fuc1+fuc2:' + r1 + '+' + r3);
			}, function(r1, r2) {
			    doly.log('9');
				equal('fuc1+fuc2:fail:' + r1 + '+' + r2, 'fuc1+fuc2:fail:undefined+reject2');
			});
			doly.when(fuc3(), fuc4()).then(function(r1, r3) {
			    //equal('fuc3+fuc4:' + r1 + '+' + r3);
			}, function(r1, r2) {
			    doly.log('10');
			    equal('fuc3+fuc4:fail:' + r1 + '+' + r2, 'fuc3+fuc4:fail:undefined+reject4');
			});
			var d1 = fuc1();
			var d2 = fuc2();
			var d3 = fuc3();
			var d4 = fuc4();
			var d5 = fuc5();
			var d6 = fuc6();
			d1.done(function(s1) {
			    doly.log('11');
				equal('d1:' + s1, 'd1:resolved1');
			});
			d2.fail(function(s1) {
			    doly.log('12');
				equal('d2:fail:' + s1, 'd2:fail:reject2');
			});
			d3.done(function(s1) {
			    doly.log('13');
				equal('d3:' + s1, 'd3:resolved3');
			});
			d4.fail(function(s1) {
			    doly.log('14');
			    equal('d4:fail:' + s1, 'd4:fail:reject4');
				d1.destory();
				d2.destory();
				d3.destory();
				d4.destory();
				d5.destory();
				d6.destory();
				setTimeout(function() {
				    start();
				}, 10);
			});
			d5.done(function(s1) {
			    doly.log('15');
				equal('d5:' + s1, 'd5:resolved5');
			});
			d6.fail(function(s1) {
			    doly.log('16');
				equal('d6:fail:' + s1, 'd6:fail:reject6');
			});
			doly.when(d1, d2, d3, d4).then(function(r1, r2, r3, r4) {
			   // equal('d1, d2, d3, d4:' + r1 + '+' + r2 + '+' + r3 + '+' + r4);
			}, function(r1, r2, r3, r4) {
			    doly.log('17');
				equal('d1, d2, d3, d4:fail:' + r1 + '+' + r2 + '+' + r3 + '+' + r4, 'd1, d2, d3, d4:fail:undefined+reject2+undefined+undefined');
			});
			var a = doly.when(d1, d3).then(function(r1, r2) {
			    doly.log('18');
			    equal('d1, d3:' + r1 + '+' + r2, 'd1, d3:resolved1+resolved3');
			}, function(r1, r2) {
			   // equal('d1, d3:fail:' + r1 + '+' + r2);
			});
			doly.when(d4, d2).then(function(r1, r2) {
			    //equal('d4, d2:' + r1 + '+' + r2);
			}, function(r1, r2) {
			    doly.log('19');
				equal('d4, d2:fail:' + r1 + '+' + r2, 'd4, d2:fail:undefined+reject2');
			});
			doly.when(d1, d5).then(function(r1, r2) {
			    doly.log('20');
				equal('d1, d5:' + r1 + '+' + r2, 'd1, d5:resolved1+resolved5');
			});
			doly.when(d5, d6).fail(function(r1, r2) {
			    doly.log('21');
				equal('d5, d6:fail:' + r1 + '+' + r2, 'd5, d6:fail:undefined+reject6');
			}).done(function(r1, r2) {
			    //equal('d5, d6:' + r1 + '+' + r2);
			});
			doly.when(d2, d4, d6).fail(function(r1, r2, r3) {
			    doly.log('22');
			    equal('d2, d4, d6:fail:' + r1 + '+' + r2 + '+' + r3, 'd2, d4, d6:fail:undefined+undefined+reject6');
			});
			doly.when(d1, d2, d3, d4, d5, d6).then(function(r1, r2, r3, r4, r5, r6) {
			    //equal('d1, d2, d3, d4, d5, d6:' + r1 + '+' + r2 + '+' + r3 + '+' + r4 + '+' + r5 + '+' + r6);
			}, function(r1, r2, r3, r4, r5, r6) {
			    doly.log('23');
				equal('d1, d2, d3, d4, d5, d6:fail:' + r1 + '+' + r2 + '+' + r3 + '+' + r4 + '+' + r5 + '+' + r6, 'd1, d2, d3, d4, d5, d6:fail:undefined+undefined+undefined+undefined+undefined+reject6');
			});
			doly.when(d5).done(function(s) {
			    doly.log('24');
				equal('d5-when:' + s, 'd5-when:resolved5');
			});
			// start();
		});
	});
});