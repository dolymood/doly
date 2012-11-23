/**
 * test
 */

define(['Animal'], function(Animal) {
	var Person = Animal.extend({
		init: function(name, age) {
			this.name = name;
			this.age = age;
		},
		
		say: function() {
			return this.name + '`s age is ' + this.age;
		}
	});
	Person.implement({
		run: function() {
			return this.name + ' run';
		}
	});
	
	return Person;
});