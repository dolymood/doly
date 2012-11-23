/**
 * test
 */

define(['Person'], function(Person) {
	var Author = _$.Class.create({
		Extends: Person,
		Implements: {
		    sayName: function() {
				return this.name;
			},
			walk: function() {
				return this.name + ' walk';
			}
		},
		init: function(name, age, booknames) {
			Author._superClass.call(this, name, age);
			this.booknames = booknames;
		},
		
		show: function() {
			return this.name + '`s books are ' + this.booknames.join('|');
		},
		
		say: function() {
			return Author._super.say.apply(this) + ' and his books are ' + this.booknames.join('|');
		}
	});
	Author.implement({
		showFirst: function() {
			return this.name + '`s first book is ' + this.booknames[0];
		}
	});
	return Author;
});