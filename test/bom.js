$(function() {
	module('bom');
	
	asyncTest('cookie', function() {
		
		_$.require(['$bom'], function() {
		    var cookie = _$.cookie;
			cookie.set('doly', 'test', 10);
			equal(cookie.get('doly'), 'test');
			cookie.remove('doly');
			equal(cookie.get('doly'));
			start();
		});
	});
	asyncTest('client', function() {
		
		_$.require(['$bom'], function() {
		    var client = _$.client(),
			    engine = client.engine,
				browser = client.browser,
				system = client.system,
				name = client.name;
			ok(engine.webkit);
			ok(browser.chrome);
			ok(system.win);
			ok(name.chrome);
			start();
		});
	});
});