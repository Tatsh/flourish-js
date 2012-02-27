/*jshint evil:true */ /* for now */
/**
 * JSON encoding and decoding.
 * @constructor
 */
var fJSON = function () {};
/**
 * The last error that occurred during last encoding/decoding.
 * @type number
 * @private
 */
fJSON.lastError = 0;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_ARRAY_OPEN = 0;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_ARRAY_COMMA = 1;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_ARRAY_CLOSE = 2;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_OBJ_OPEN = 3;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_KEY = 4;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_COLON = 5;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_OBJ_COMMA = 6;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_OBJ_CLOSE = 7;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_INTEGER = 8;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_FLOAT = 9;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_TRUE = 10;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_FALSE = 11;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_NULL = 12;
// /**
//  * @type number
//  * @private
//  */
// fJSON.J_STRING = 13;
// /**
//  * @type Object
//  * @private
//  */
// fJSON.controlCharacterMap = {
//   '"':   '\\"',
//   '\\':  '\\\\',
//   '/':   '\/',
//   "\x8": '\b',
//   "\xC": '\f',
//   "\n": '\n',
//   "\r": '\r',
//   "\t": '\t'
// };
// /**
//  * Hash of allowed values after other values.
//  * @type Object
//  * @private
//  */
// fJSON.nextValues = {};
// fJSON.nextValues[fJSON.J_ARRAY_OPEN] = {};
// fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_ARRAY_OPEN] = true;
// fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_ARRAY_CLOSE] = true;
// fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_OBJ_OPEN] = true;
// fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_INTEGER] = true;
// fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_FLOAT] = true;
// fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_TRUE] = true;
// fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_FALSE] = true;
// fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_NULL] = true;
// fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_STRING] = true;
// fJSON.nextValues[fJSON.J_ARRAY_COMMA] = {};
// fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_ARRAY_OPEN] = true;
// fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_OBJ_OPEN] = true;
// fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_INTEGER] = true;
// fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_FLOAT] = true;
// fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_TRUE] = true;
// fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_FALSE] = true;
// fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_NULL] = true;
// fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_STRING] = true;
// fJSON.nextValues[fJSON.J_ARRAY_CLOSE] = {};
// fJSON.nextValues[fJSON.J_ARRAY_CLOSE][fJSON.J_ARRAY_CLOSE] = true;
// fJSON.nextValues[fJSON.J_ARRAY_CLOSE][fJSON.J_OBJ_CLOSE] = true;
// fJSON.nextValues[fJSON.J_ARRAY_CLOSE][fJSON.J_ARRAY_COMMA] = true;
// fJSON.nextValues[fJSON.J_ARRAY_CLOSE][fJSON.J_OBJ_COMMA] = true;
// fJSON.nextValues[fJSON.J_OBJ_OPEN] = {};
// fJSON.nextValues[fJSON.J_OBJ_OPEN][fJSON.J_OBJ_CLOSE] = true;
// fJSON.nextValues[fJSON.J_OBJ_OPEN][fJSON.J_KEY] = true;
// fJSON.nextValues[fJSON.J_KEY] = {};
// fJSON.nextValues[fJSON.J_KEY][fJSON.J_COLON] = true;
// fJSON.nextValues[fJSON.J_OBJ_COMMA] = {};
// fJSON.nextValues[fJSON.J_OBJ_COMMA][fJSON.J_KEY] = true;
// fJSON.nextValues[fJSON.J_COLON] = {};
// fJSON.nextValues[fJSON.J_COLON][fJSON.J_ARRAY_OPEN] = true;
// fJSON.nextValues[fJSON.J_COLON][fJSON.J_OBJ_OPEN] = true;
// fJSON.nextValues[fJSON.J_COLON][fJSON.J_INTEGER] = true;
// fJSON.nextValues[fJSON.J_COLON][fJSON.J_FLOAT] = true;
// fJSON.nextValues[fJSON.J_COLON][fJSON.J_TRUE] = true;
// fJSON.nextValues[fJSON.J_COLON][fJSON.J_FALSE] = true;
// fJSON.nextValues[fJSON.J_COLON][fJSON.J_NULL] = true;
// fJSON.nextValues[fJSON.J_COLON][fJSON.J_STRING] = true;
// fJSON.nextValues[fJSON.J_OBJ_CLOSE] = {};
// fJSON.nextValues[fJSON.J_OBJ_CLOSE][fJSON.J_ARRAY_OPEN] = true;
// fJSON.nextValues[fJSON.J_OBJ_CLOSE][fJSON.J_OBJ_CLOSE] = true;
// fJSON.nextValues[fJSON.J_OBJ_CLOSE][fJSON.J_ARRAY_COMMA] = true;
// fJSON.nextValues[fJSON.J_OBJ_CLOSE][fJSON.J_OBJ_COMMA] = true;
// fJSON.nextValues[fJSON.J_INTEGER] = fJSON.nextValues[fJSON.J_OBJ_CLOSE];
// fJSON.nextValues[fJSON.J_FLOAT] = fJSON.nextValues[fJSON.J_OBJ_CLOSE];
// fJSON.nextValues[fJSON.J_TRUE] = fJSON.nextValues[fJSON.J_OBJ_CLOSE];
// fJSON.nextValues[fJSON.J_FALSE] = fJSON.nextValues[fJSON.J_OBJ_CLOSE];
// fJSON.nextValues[fJSON.J_NULL] = fJSON.nextValues[fJSON.J_OBJ_CLOSE];
// fJSON.nextValues[fJSON.J_STRING] = fJSON.nextValues[fJSON.J_OBJ_CLOSE];
//
// fJSON._stack = [];
//
// fJSON.getElementType = function (last, element) {
//   if (element === '[') {
//     return fJSON.J_ARRAY_OPEN;
//   }
//   if (element === ']') {
//     return fJSON.J_ARRAY_CLOSE;
//   }
//   if (element === '{') {
//     return fJSON.J_OBJ_OPEN;
//   }
//   if (element === '}') {
//     return fJSON.J_OBJ_CLOSE;
//   }
//   if (!isNaN(parseInt(element, 10))) {
//     return fJSON.J_INTEGER;
//   }
//   if (!isNaN(parseFloat(element))) {
//     return fJSON.J_FLOAT;
//   }
//   if (element === 'true') {
//     return fJSON.J_TRUE;
//   }
//   if (element === 'false') {
//     return fJSON.J_FALSE;
//   }
//   if (element === 'null') {
//     return fJSON.J_NULL;
//   }
//
//   lastStack = fJSON._stack[stack.length - 1];
//
//   if (element === ',' && lastStack[0] === fJSON.J_ARRAY_OPEN) {
//     return fJSON.J_ARRAY_COMMA;
//   }
//
//   if (element === ',') {
//     return fJSON.J_OBJ_COMMA;
//   }
//
//   if (element === ':') {
//     return fJSON.J_COLON;
//   }
//
//   if (last === fJSON.J_OBJ_OPEN || last === fJSON.J_OBJ_COMMA) {
//     return fJSON.J_KEY;
//   }
//
//   return fJSON.J_STRING;
// };
//
// fJSON.decode2 = function (json) {
//   if (json === undefined) {
//     return null;
//   }
//   // TODO Test if is numeric
//
//   json = fUTF8.trim(json);
//
//   if (json === '') {
//     return null;
//   }
//
//   var matchedLength = 0, matches;
//   var last = null;
//   var lastKey = null;
//   var output = null;
//   var container = null;
//
//   matches = json.match(/\[|\]|\{|\}|\-?(?:0|[1-9]\d*)(?:\.\d*(?:[eE][\+\-]?\d+)?|(?:[eE][\+\-]?\d+))|\-?(?:0|[1-9]\d*)|true|false|null|,|\:"(?:(?:(?!\\\\u)[^\\\\"\n\b\f\r\t]+)|\\\\\\\\|\\\\\/|\\\\"|\\\\b|\\\\f|\\\\n|\\\\r|\\\\t|\\\\u[0-9a-fA-F]{4})*"|\s+/g); // supposed to be /x
//
//   if (matches.length === 1 && matches[0].length === json.length) {
//     var match = matches[0];
//     fJSON._stack = [];
//     var type = fJSON.getElementType(fJSON.J_ARRAY_OPEN, match);
//   }
// };

/**
 * Decodes JSON to JavaScript object. Based on phpjs' version. Sets
 *   fJSON.lastError.
 * @param {string} str_json JSON string.
 * @returns {*} A JavaScript object or null. Can also return undefined.
 */
fJSON.decode = function (str_json) {
    // http://kevin.vanzonneveld.net
    // +      original by: Public Domain (http://www.json.org/json2.js)
    // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      improved by: T.J. Leahy
    // +      improved by: Michael White
    // *        example 1: json_decode('[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]');
    // *        returns 1: ['e', {pluribus: 'unum'}]
/*
        http://www.JSON.org/json2.js
        2008-11-19
        Public Domain.
        NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
        See http://www.JSON.org/js.html
    */

    // Strip white-space because IE cannot handle it
    str_json = fUTF8.trim(str_json);

    var json = window.JSON;
    if (json && json.parse) {
        try {
            return json.parse(str_json);
        } catch (err) {
            if (!(err instanceof SyntaxError)) {
                fCore.debug('Unexpected error type in native JSON decoder');
            }
            fJSON.lastError = 4;
            return null;
        }
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var j;
    var text = str_json;

    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.
    cx.lastIndex = 0;
    if (cx.test(text)) {
        text = text.replace(cx, function (a) {
            return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
    }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.
    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
    if ((/^[\],:{}\s]*$/).
    test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.
        j = eval('(' + text + ')');

        return j;
    }

    fJSON.lastError = 4; // usable by json_last_error()
    return null;
};
/**
 * Encode a JavaScript object to a JSON string. Based on phpjs' version.
 * @param {*} mixed_val Value to encode.
 * @returns {string} JSON string.
 */
fJSON.encode = function (mixed_val) {
    // http://kevin.vanzonneveld.net
    // +      original by: Public Domain (http://www.json.org/json2.js)
    // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      improved by: Michael White
    // +      input by: felix
    // +      bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *        example 1: json_encode(['e', {pluribus: 'unum'}]);
    // *        returns 1: '[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]'
/*
        http://www.JSON.org/json2.js
        2008-11-19
        Public Domain.
        NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
        See http://www.JSON.org/js.html
    */
    var retVal, json = window.JSON;
    try {
        if (typeof json === 'object' && typeof json.stringify === 'function') {
            retVal = json.stringify(mixed_val); // Errors will not be caught here if our own equivalent to resource
            //  (an instance of PHPJS_Resource) is used
            if (retVal === undefined) {
                //throw new SyntaxError('json_encode');
                fCore.debug('Native JSON encoder returned undefined.');
                retVal = null;
            }
            return retVal;
        }

        var value = mixed_val;

        var quote = function (string) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = { // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        };

        var str = function (key, holder) {
            var gap = '';
            var indent = '    ';
            var i = 0; // The loop counter.
            var k = ''; // The member key.
            var v = ''; // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                // JSON numbers must be finite. Encode non-finite numbers as null.
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.
                return String(value);

            case 'object':
                // If the type is 'object', we might be dealing with an object or an array or
                // null.
                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.
                if (!value) {
                    return 'null';
                }
//                 if ((this.PHPJS_Resource && value instanceof this.PHPJS_Resource) || (window.PHPJS_Resource && value instanceof window.PHPJS_Resource)) {
//                     throw new SyntaxError('json_encode');
//                 }

                // Make an array to hold the partial results of stringifying this object value.
                gap += indent;
                partial = [];

                // Is the value an array?
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // Iterate through all of the keys in the object.
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            case 'undefined':
                // Fall-through
            case 'function':
                /* falls through */
            default:
                fCore.debug('Cannot encode type %s', typeof value);
            }
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });

    } catch (err) { // Todo: ensure error handling above throws a SyntaxError in all cases where it could
        // (i.e., when the JSON global is not available and there is an error)
        if (!(err instanceof SyntaxError)) {
            fCore.debug('Unexpected error type in non-native JSON encoder. Returning null.');
        }
        fJSON.lastError = 4;
    }
    return '';
};
