/**
 * module query
 */

define('query', ['$sizzle'], function(Sizzle) {
    'use strict';
    
    var query = {
        
        find: Sizzle,
        text: Sizzle.getText,
        expr: Sizzle.selectors,
        unique: Sizzle.uniqueSort,
        matches: Sizzle.matches,
        isXMLDoc: Sizzle.isXML,
        eleContains: Sizzle.contains
        matchesSelector: Sizzle.matchesSelector
        
    };
    
    query.expr[':'] = query.expr.pseudos;
    doly.mixin(doly, query);
    return query;
});