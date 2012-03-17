/**
 * Provides request-related methods.
 * @constructor
 */
var fRequest = function () {};
/**
 * @type (Object|null)
 * @private
 */
fRequest._REQUEST = null;

/**
 * Casts the value to a type specified.
 * @private
 * @param {string} value Value to cast.
 * @param {string} to Cast to type. One of 'number' or 'float'.
 * @returns {number|string|boolean}
 */
fRequest._cast = function (value, to) {
  var lcValue, trues = {
    'true': 1,
    'yes': 1,
    'on': 1
  };

  switch (to) {
    case 'number':
      return parseInt(value, 10);

    case 'float':
      return parseFloat(value);

    case 'bool':
    case 'boolean':
      lcValue = value.toLowerCase();
      return trues[lcValue] !== undefined;
  }

  return value;
};
/**
 * Initialises the class.
 * @private
 */
fRequest._initialize = function () {
  if (fRequest._REQUEST === null) {
    var qs = fURL.getQueryString();
    var items = qs.split('&');
    var itemsAsObject = {}, current;

    for (var i = 0; i < items.length; i++) {
      current = items[i].split('=');
      itemsAsObject[current[0]] = current[1];
    }

    fRequest._REQUEST = itemsAsObject;
  }
};
/**
 * Gets a value from the query string.
 * @param {string} name The key to get the value of.
 * @param {string} [castTo=null] Cast the value to this data type. One of:
 *   'number', 'float', 'bool', 'boolean'.
 * @param {string|number|null|boolean} [defaultValue=null] The default value to
 *   return if the key does not exist.
 * @param {boolean} [useDefaultForBlank=false] If the request value is a blank
 *   string and <code>defaultValue</code> is specified,
 *   <code>defaultValue</code> will be returned.
 * @returns {string|null|number|boolean} The value or null if the value does
 *   not exist and <code>defaultValue</code> is not specified.
 */
fRequest.get = function (name, castTo, defaultValue, useDefaultForBlank) {
  fRequest._initialize();

  useDefaultForBlank === undefined && (useDefaultForBlank = false);

  if (defaultValue === undefined) {
    defaultValue = null;
  }
  if (castTo === undefined) {
    castTo = 'string';
  }

  if (!fURL.getQueryString() || fRequest._REQUEST[name] === undefined ||
    (fRequest._REQUEST[name] === '' && useDefaultForBlank)) {
    return defaultValue;
  }

  var ret = fRequest._cast(fRequest._REQUEST[name], castTo);
  if (isNaN(ret) && (castTo === 'number' || castTo === 'float')) {
    ret = null;
  }

  return ret;
};
