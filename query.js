/**
 * module query
 */

define('query', ['$sizzle'], function(Sizzle) {
    'use strict';

    var
	query = {
        
        find: Sizzle,
        getText: function(elem) {
		    var ret;
			if (typeof elem === 'string') {
			    elem = Sizzle(elem);
			}
			return Sizzle.getText(elem);
		},
        expr: Sizzle.selectors,
        unique: Sizzle.uniqueSort,
        matches: Sizzle.matches,
        isXMLDoc: Sizzle.isXML,
        eleContains: Sizzle.contains,
        matchesSelector: Sizzle.matchesSelector
        
    };
    
    query.expr[':'] = query.expr.pseudos;
    doly.mixin(query);
    return query;
});