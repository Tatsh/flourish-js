/*jshint expr:true */
/**
 * Front end to web localStorage object for browsers that support it. There is
 *   no fallback yet.
 * @constructor
 */
var fSession = function () {};
/**
 * If session storage is supported.
 * @type boolean
 * @private
 */
fSession.isSupported = (function () {
  return 'sessionStorage' in window;
})();
/**
 * Local reference to session.
 * @type Storage|undefined
 * @private
 */
fSession.store = window.sessionStorage;
/**
 * Add a value. Object key access is not supported.
 * @param {string} key Key.
 * @param {string|number|boolean} value Value to store.
 * @param {boolean} beginning If the value should be added to the beginning.
 */
fSession.add = function (key, value, beginning) {
  if (!fSession.isSupported) {
    return;
  }

  beginning === undefined && (beginning = false);

  var item = fSession.store.getItem(key);

  if (item === null) {
    item = '';
  }

  if (!beginning) {
    return fSession.store.setItem(key, item + String(value));
  }

  return fSession.store.setItem(key, String(value) + item);
};
/**
 * Removes all session values with the provided prefix.
 * @param {string|null} [prefix=null] Prefix to clear all session values for.
 */
fSession.clear = function (prefix) {
  if (!fSession.isSupported) {
    return;
  }

  prefix === undefined && (prefix = null);

  if (!prefix) {
    return fSession.store.clear();
  }

  for (var key, prefixLength = prefix.length, i = 0; i < fSession.store.length; i++) {
    key = fSession.store.key(i);
    if (key.substr(0, prefixLength) === prefix) {
      fSession.store.removeItem(key);
    }
  }
};
/**
 * Delete a value. This cannot be called <code>delete</code> because
 *   <code>delete</code> is a reserved word in JavaScript.
 * @param {string} key Key. Object key access is not supported.
 * @param {string|null} [defaultValue=null] The default value to return if
 *   <code>key</code> is not set.
 * @returns {string|null} The value of the key that was deleted.
 */
fSession.deleteKey = function (key, defaultValue) {
  if (defaultValue === undefined) {
    defaultValue = null;
  }

  if (!fSession.isSupported) {
    return defaultValue;
  }

  var returnValue = String(fSession.store.getItem(key));

  if (returnValue === 'null') {
    returnValue = defaultValue;
  }

  fSession.store.removeItem(key);

  return returnValue;
};
/**
 * Deletes all values in the session storage.
 */
fSession.destroy = function () {
  if (!fSession.isSupported) {
    return;
  }
  fSession.store.clear();
};
/**
 * Get data from the session storage.
 * @param {string} key Key. Object key access is not supported.
 * @param {string|null} [defaultValue=null] The default value to return if
 *   <code>key</code> does not exist.
 * @returns {string|null} The key value.
 */
fSession.get = function (key, defaultValue) {
  if (defaultValue === undefined) {
    defaultValue = null;
  }

  if (!fSession.isSupported) {
    return defaultValue;
  }

  var item = String(fSession.store.getItem(key));

  if (item === 'null') {
    item = defaultValue;
  }

  return item;
};
/**
 * Set data to session storage.
 * @param {string} key Key to set.
 * @param {string|boolean|number} value Value to set.
 */
fSession.set = function (key, value) {
  if (!fSession.isSupported) {
    return;
  }

  value === undefined && (value = '');
  return fSession.store.setItem(key, String(value));
};
