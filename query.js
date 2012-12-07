/**
 * module query
 */

define('query', ['$sizzle'], function(Sizzle) {
    'use strict';

    var
    query = {
        
        find: Sizzle,
        text: Sizzle.getText,
        expr: Sizzle.selectors,
        unique: Sizzle.uniqueSort,
        matches: Sizzle.matches,
        isXMLDoc: Sizzle.isXML,
        containsEle: Sizzle.contains,
        matchesSelector: Sizzle.matchesSelector
        
    };
    
    query.expr[':'] = query.expr.pseudos;
    doly.mix(doly, query);
    return doly;
});