$(function() {
	module('class');
	asyncTest('class||factory', function() {

		_$.require(['$class'], function() {
		    
			var Animal = _$.factory();
			
			var People = _$.factory(Animal, {
			    init: function(name) {
				    this.name = name;
				},
				
				sayName: function() {
				    return this.name;
				}
			});
			People.implement({
			    walk: function() {
				    return this.name + ' walk';
				}
			});
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
			
			var Author = _$.Class.create({
			    Extends: Person,
				Implements: People,
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
			
			var animal = new Animal();
			ok(animal instanceof Animal);
			ok(animal instanceof doly.Class);
			
			var people = new People('people');
			equal(people.sayName(), 'people');
			equal(people.walk(), 'people walk');
			ok(people instanceof Animal);
			
			var person = new Person('person', 20);
			equal(person.say(), 'person`s age is 20');
			equal(person.run(), 'person run');
			ok(person instanceof Animal);
			
			var author = new Author('author', 50, ['bookname1', 'bookname2']);
			equal(author.say(), 'author`s age is 50 and his books are bookname1|bookname2');
			equal(author.run(), 'author run');
			equal(author.sayName(), 'author');
			equal(author.walk(), 'author walk');
			equal(author.show(), 'author`s books are bookname1|bookname2');
			equal(author.showFirst(), 'author`s first book is bookname1');
			ok(person instanceof Person);
			ok(person instanceof Animal);
			
			start();
		});
	});
	
	asyncTest('class + require', function() {
		_$.require(['Author'], function(Author) {
		    var author = new Author('author', 50, ['bookname1', 'bookname2']);
			equal(author.say(), 'author`s age is 50 and his books are bookname1|bookname2');
			equal(author.run(), 'author run');
			equal(author.sayName(), 'author');
			equal(author.walk(), 'author walk');
			equal(author.show(), 'author`s books are bookname1|bookname2');
			equal(author.showFirst(), 'author`s first book is bookname1');
			start();
		});
	});
});